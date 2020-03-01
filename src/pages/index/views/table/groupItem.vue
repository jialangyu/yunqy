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
                        </el-date-picker> 年</div>
                    </h4>
                    <bar-chart :barData="barDataGroup"></bar-chart>
                    <h4>按分类统计</h4>
                    <pie-chart :pieData="pieDataGroup" v-if="sumCount"></pie-chart>
                </div>
            </el-tab-pane>
            <el-tab-pane name="1">
                <span slot="label"><i class="el-icon-tickets"></i> 账单明细</span>
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item>
                        <el-select clearable v-model="searchMap.typeid" placeholder="请选择缴费类型" size="small">
                            <el-option v-for="item in typeList" :key="item.id"
                                    :label="item.typename" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select clearable v-model="searchMap.payuserid" placeholder="请选择缴费人" size="small">
                            <el-option v-for="item in userListGroup" :key="item.id"
                                        :label="item.username" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker clearable
                            v-model="searchMap.rangeTime"
                            size="small"
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
                        <el-button type="primary" size="small" @click="dialogFormVisible = true;pojo={};id=null">新增</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="list">
                    <el-table-column prop="typeid" label="缴费类型">
                        <template slot-scope="scope">
                            {{scope.row.typeid | typeInfo}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="paycount" label="缴费总额"></el-table-column>
                    <el-table-column prop="payuserid" label="缴费人">
                        <template slot-scope="scope">
                            {{scope.row.payuserid | uInfo}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="shareuserid" label="平摊人">
                        <template slot-scope="scope">
                            {{scope.row.shareuserid | uInfo}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="sharemoney" label="均摊金额"></el-table-column>
                    <el-table-column prop="paytime" label="缴费日期"></el-table-column>
                    <el-table-column prop="remark" label="缴费备注"></el-table-column>
                    <el-table-column fixed="right" label="操作" align="center" width="150">
                        <template slot-scope="scope">
                            <el-button @click="findById(scope.row.id)" type="primary" size="mini" :disabled="clickable(scope.row)">修改</el-button>
                            <el-button @click="deleteById(scope.row.id)" type="danger" size="mini" :disabled="clickable(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination @size-change="currentPageSize" @current-change="search"
                            :current-page.sync="page" :page-sizes="[5, 10, 20, 30]"
                            :page-size="size" layout="total, sizes, prev, pager, next" :total="total">
                </el-pagination>

                <el-dialog title="新增缴费" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
                    <el-form label-width="100px">
                        <el-form-item label="缴费类型" >
                            <el-radio-group v-model="pojo.typeid" size="small" style="margin-bottom:-10px;">
                                <el-radio-button v-for="item in typeList" :key="item.id"
                                            :label="item.id" :value="item.id">{{item.typename}}</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="缴费人" >{{UName}}</el-form-item>
                        <el-form-item label="缴费日期" >
                            <el-date-picker
                                v-model="pojo.paytime"
                                type="date"
                                :editable="false"
                                placeholder="选择缴费日期"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="缴费金额" >
                            <el-input v-model="pojo.paycount" @change="changePtAllCostFun"></el-input>
                        </el-form-item>
                        <el-form-item label="平摊人" >
                            <el-select v-model="ptUserArr" multiple placeholder="请选择"
                                @change="changePtUserFun">
                                <el-option v-for="item in userListGroup" :key="item.id"
                                            :label="item.username" :value="item.id" :disabled="item.id===UID">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="均摊金额" >
                            <el-input v-model="pojo.sharemoney" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="备注" >
                            <el-input v-model="pojo.remark" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import paymoneyApi from "@/api/paymoney"
import groupApi from "@/api/group"
import PieChart from '@/components/ECharts/PieChart'
import BarChart from '@/components/ECharts/BarChart'
import { arrToStr, strToArr } from '@/utils'

export default {
    data() {
        return {
            tabItem: '1',
            pickerOptions: {
                disabledDate(time) { 
                    return time.getTime() > Date.now()
                } 
            },
            groupid: '',
            pieDataGroup: {
                topic: '当前群组消费',
                subTopic: '本人均摊消费： ￥0',
                sum: 0,
                tit: [],
                sData: []
            },
            barDataGroup: {
                topic: '年度总消费统计',
                xData: [],
                yData: []
            },
            list:null,
            searchMap:{
                typeid: '',
                payuserid: '',
                rangeTime: ''
            },
            userListGroup: [],
            startTime: '',
            endTime: '',
            moneyList:null,
            dialogFormVisible :false,
            pojo:{},
            id:null,
            page:1,
            size:10,
            total:0,
            sumCount:0,
            ptUserArr: [],
            selectedYear: new Date()
        }
    },
    components: {
        PieChart,
        BarChart
    },
    computed: {
        // userList() {
        //    return this.$store.getters.uListArrs 
        // },
        typeList() {
           return this.$store.getters.typeArrs
        },
        UID() {
            return this.$store.getters.userid
        },
        UName() {
            return this.$store.getters.name
        },
        roles() {
            return this.$store.getters.roles
        }
    },
    created() {
        if (this.$route.query.id) {
            this.groupid = this.$route.query.id
            this.search()
            this.getSumCount()
            this.findAllUserById()
            this.getGroupAllCosts()
        }
    },
    methods: {
        changeFun(val) {
            if (val) {
                this.startTime = val[0]
                this.endTime = val[1]
            }
        },
        findAllUserById() {
            groupApi.findAllUserById(this.groupid).then(response => {
                if (response.flag && response.data) { 
                    this.ptUserArr.push(this.UID)
                    this.userListGroup =  response.data
                }
            })
        },
        changePtAllCostFun(val) {
            this.pojo.paycount = val
            this.countPtpay()
        },
        changePtUserFun(val) {
            this.ptUserArr = val
            this.countPtpay()
        },
        countPtpay() {
            this.pojo.sharemoney = this.pojo.paycount
            if (this.ptUserArr.length > 1) {
                this.pojo.sharemoney = (Number(this.pojo.paycount) / this.ptUserArr.length).toFixed(2)
            }
            this.$forceUpdate()
        },
        fetchData() {
            paymoneyApi.getList().then(response => {
                this.list = response.data;
            })
        },
        //保存新增活动
        saveOrUpdate() {
            this.pojo.payuserid = this.UID
            // this.pojo.typeid = arrToStr(this.pojo.typeid)
            this.pojo.groupid = this.groupid
            this.pojo.shareuserid = arrToStr(this.ptUserArr)
            paymoneyApi.saveOrUpdate(this.id,this.pojo).then( response => {
                this.$message({
                    showClose: true,
                    message: response.message,
                    type: response.flag?'success':'error'
                });
                //保存成功(flag=true),关闭弹出框,并刷新列表
                if(response.flag){
                    this.dialogFormVisible = false  //关闭弹出框
                    this.search()
                    this.getGroupAllCosts()
                }
            })       
        },
        findById(id) {
            this.id = id;
            this.ptUserArr = []
            paymoneyApi.findById(id).then(response => {
                this.pojo = response.data;
                this.ptUserArr = strToArr(this.pojo.shareuserid)
                this.dialogFormVisible = true
            })
        },
        //根据id删除活动
        deleteById(id) {
            this.$confirm('确定要删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {  //点击确定,进入then()方法,删除活动
                paymoneyApi.deleteById(id).then( response => {
                    this.$message({
                        showClose: true,
                        message: response.message,
                        type: response.flag?'success':'error'
                        });
                    if(response.flag){
                        this.search()
                        this.getGroupAllCosts()
                    }
                })  
            })  
        },
         //分页查询的方法
        search() {
            paymoneyApi.findSearch({
              groupid: this.groupid,
              payuserid: this.searchMap.payuserid,
              typeid: this.searchMap.typeid,
              startTime: this.startTime,
              endTime: this.endTime,
              page: this.page,
              size: this.size
            }).then( response => {
                this.list = response.data.rows
                this.total = response.data.total
            })
        },
        currentPageSize(val){
            this.size = val
            this.search()
        },
        clickable(row) {
            return this.roles.indexOf('0')>-1 && this.UID!==row.payuserid
        },
        changedYear(val) {
            this.getSumCount()
        },
        getSumCount() {
            const year = this.selectedYear.getFullYear()
            paymoneyApi.findSumByYear(this.groupid, year).then(response => {
               if (response.flag && response.data) {
                    this.barDataGroup.xData = Object.keys(response.data)
                    this.barDataGroup.yData = Object.values(response.data)
                } 
            })
        },
        async getGroupAllCosts() {
            var titArr = []
            var arrObj = []
            paymoneyApi.findSumCount(this.groupid).then( response => {
                if (response.flag && response.data) {
                    this.pieDataGroup.sum = response.data
                    this.sumCount = response.data
                }
            })
            paymoneyApi.findSumCountShareByUser(this.groupid, this.UID).then( response => {
                if (response.flag && response.data) {
                    this.pieDataGroup.subTopic = '本人均摊缴费： ￥' + response.data
                }
            })
            var typeList = this.typeList
            for (let i = 0; i < typeList.length; ++i) {
                let typeResult = await paymoneyApi.findSumCountByType(this.groupid,typeList[i].id)
                if (typeResult.flag && typeResult.data) {
                    titArr.push(typeList[i].typename)
                    let cur = {
                        value: typeResult.data || 0,
                        name: typeList[i].typename
                    }
                    arrObj.push(cur)
                }
            }
            this.pieDataGroup.tit = titArr
            this.pieDataGroup.sData = arrObj
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
