<template>
    <div>
        <el-tabs type="border-card" v-model="tabItem">
            <el-tab-pane name="2" lazy>
                <span slot="label"><i class="el-icon-time"></i> 统计</span>
                <div class="chart-wrapper" v-if="tabItem==='2'">
                    <h4>
                        按月份统计
                        <div>
                            <el-date-picker style="width: 90px" v-model="selectedYear" :clearable="false" :editable="false"
                                type="year" size="mini" @change="changedYear" :picker-options="pickerOptions">
                            </el-date-picker> 年
                        </div>
                    </h4>
                    <bar-chart :barData="barDataOwner" v-if="sumCount"></bar-chart>
                    <h4>按分类统计</h4>
                    <pie-chart :pieData="pieDataOwner" v-if="sumCount"></pie-chart>
                </div>
            </el-tab-pane>
            <el-tab-pane name="1">
                <span slot="label"><i class="el-icon-tickets"></i> 账单明细</span>
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item>
                        <el-select clearable v-model="searchTypeid" placeholder="请选择缴费类型" size="small">
                            <el-option v-for="item in typeList" :key="item.id"
                                    :label="item.typename" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker clearable
                            v-model="rangeTime" size="small"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            @change="changeFun">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="primary" @click="search()" size="small">查询</el-button>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="primary" @click="dialogFormVisible = true;pojo={};id=null" size="small">新增</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="list">
                    <el-table-column prop="typeid" label="缴费类型">
                        <template slot-scope="scope">
                            {{scope.row.typeid | typeInfo}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="paycount" label="缴费金额">
                        <template slot-scope="scope">
                            ￥{{scope.row.paycount}}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="userid" label="缴费人">
                        <template slot-scope="scope">
                            {{scope.row.userid | uInfo}}
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="paytime" label="缴费日期"></el-table-column>
                    <el-table-column prop="remark" label="缴费备注"></el-table-column>
                    <el-table-column fixed="right" label="操作" align="center" width="150">
                        <template slot-scope="scope">
                            <el-button @click="findById(scope.row.id)" type="primary" size="mini">修改</el-button>
                            <el-button @click="deleteById(scope.row.id)" type="danger" size="mini">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination @size-change="currentPageSize" @current-change="search"
                            :current-page.sync="page" :page-sizes="[5, 10, 20, 30]"
                            :page-size="size" layout="total, sizes, prev, pager, next" :total="total">
                </el-pagination>

                <el-dialog title="新增缴费" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
                    <el-form :model="pojo" :rules="pojoRules" ref="pojo" label-width="100px" >
                        <el-form-item label="缴费类型" prop="typeid">
                            <el-radio-group v-model="pojo.typeid" size="small" style="margin-bottom:-10px;">
                                <el-radio-button v-for="item in typeList" :key="item.id"
                                            :label="item.id" :value="item.id">{{item.typename}}</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="缴费日期" prop="paytime">
                            <el-date-picker
                                v-model="pojo.paytime"
                                type="date"
                                :editable="false"
                                placeholder="选择缴费日期"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="缴费金额" prop="paycount">
                            <el-input v-model="pojo.paycount" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="pojo.remark" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
                        <el-button size="small" type="primary" @click="saveOrUpdate">确 定</el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import paymoneyApi from "@/api/paymoney"
import PieChart from '@/components/ECharts/PieChart'
import BarChart from '@/components/ECharts/BarChart'

export default {
    data() {
        return {
            tabItem: '1',
            pickerOptions: {
                disabledDate(time) { 
                    return time.getTime() > Date.now()
                } 
            },
            pieDataOwner: {
                topic: '个人消费',
                sum: 0,
                tit: [],
                sData: []
            },
            barDataOwner: {
                topic: '年度总消费统计',
                xData: [],
                yData: []
            },
            list:null,
            searchTypeid: '',
            rangeTime: '',
            startTime: '',
            endTime: '',
            moneyList:null,
            dialogFormVisible :false,
            pojo:{
                typeid: '',
                paytime: '',
                paycount: ''
            },
            pojoRules: {
                typeid: [{ required: true, message: '请选择缴费类型', trigger: 'blur' }],
                paytime: [{ required: true, message: '请选择缴费日期', trigger: 'blur' }],
                paycount: [{ required: true, message: '请输入缴费金额', trigger: 'blur' }]
            },
            id:null,
            page:1,
            size:10,
            total:0,
            sumCount:0,
            selectedYear: new Date()
        }
    },
    components: {
        PieChart,
        BarChart
    },
    computed: {
        userList() {
           return this.$store.getters.uListArrs 
        },
        typeList() {
           return this.$store.getters.typeArrs
        },
        UID() {
            return this.$store.getters.userid
        },
        roles() {
            return this.$store.getters.roles
        }
    },
    created() {
        this.search()
        this.getSumCountOwner()
        this.getOwnerAllCosts()
    },
    methods: {
        changeFun(val) {
            if (val) {
                this.startTime = val[0]
                this.endTime = val[1]
            }
        },
        //保存新增活动
        saveOrUpdate() {
            this.$refs['pojo'].validate((valid) => {
                if (valid) {
                    this.pojo.userid = this.UID
                    paymoneyApi.saveOrUpdateOwner(this.id,this.pojo).then( response => {
                        this.$message({
                            showClose: true,
                            message: response.message,
                            type: response.flag?'success':'error'
                        });
                        //保存成功(flag=true),关闭弹出框,并刷新列表
                        if(response.flag){
                            this.dialogFormVisible = false  //关闭弹出框
                            this.search()
                            this.getOwnerAllCosts()
                        }
                    })
                } else {
                    return false;
                }
            })       
        },
        findById(id) {
            this.id = id;
            paymoneyApi.findByIdOwner(id).then(response => {
                this.pojo = response.data;
                this.dialogFormVisible = true
            })
        },
        //根据id删除活动
        deleteById(id) {
            this.$confirm('确定要删除吗?', '提示', {
            type: 'warning'
            }).then(() => {  //点击确定,进入then()方法,删除活动
                paymoneyApi.deleteByIdOwner(id).then( response => {
                    this.$message({
                        showClose: true,
                        message: response.message,
                        type: response.flag?'success':'error'
                        });
                    if(response.flag){
                        this.search()
                        this.getOwnerAllCosts()
                    }
                })  
            })  
        },
         //分页查询的方法
        search() {
            paymoneyApi.searchOwner({
              userid: this.UID,
              typeid: this.searchTypeid,
              startTime: this.startTime,
              endTime: this.endTime,
              page: this.page,
              size: this.size
            }).then( response => {
                this.list = response.data.rows //获取列表数据
                //console.log(response.data.rows)
                this.total = response.data.total
            })
        },
        currentPageSize(val){
            this.size = val
            this.search()
        },
        changedYear(val) {
            this.getSumCountOwner()
        },
        getSumCountOwner() {
            const year = this.selectedYear.getFullYear()
            paymoneyApi.findSumByYearOwner(this.UID, year).then(response => {
               if (response.flag && response.data) {
                    this.barDataOwner.xData = Object.keys(response.data)
                    this.barDataOwner.yData = Object.values(response.data)
                } 
            })
        },
        async getOwnerAllCosts() {
            var titArr = []
            var arrObjOwner = []
            paymoneyApi.findSumCountOwner(this.UID).then( response => {
                if (response.flag && response.data) {
                    this.pieDataOwner.sum = response.data
                    this.sumCount = response.data
                }
            })
            var typeList = this.typeList
            for (let i = 0; i < typeList.length; ++i) {
                let typeResultOwner = await paymoneyApi.findSumCountByTypeOwner(this.UID, typeList[i].id)
                if (typeResultOwner.flag && typeResultOwner.data) {
                    titArr.push(typeList[i].typename)
                    let curO = {
                        value: typeResultOwner.data || 0,
                        name: typeList[i].typename
                    }
                    arrObjOwner.push(curO)
                }
            }
            this.pieDataOwner.tit = titArr
            this.pieDataOwner.sData = arrObjOwner
        }
    }
}
</script>

<style scoped lang="less">
.chart-wrapper h4{
    display: flex;
    justify-content: space-between;
}
/deep/ .el-radio-button{
    margin-right: 10px;
    margin-bottom: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    overflow: hidden;
}
/deep/ .el-radio-button--small .el-radio-button__inner{
    border: none;
    outline: none;
    padding: 5px 12px;
}
</style>