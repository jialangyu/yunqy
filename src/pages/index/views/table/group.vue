<template>
    <div>
         <el-form :inline="true" class="demo-form-inline">
            <!--<el-form-item label="缴费群组">
                <el-select v-model="searchMap.typeid" placeholder="请选择">
                    <el-option v-for="item in list" :key="item.id"
                               :label="item.typename" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择创建时间">
                <el-date-picker v-model="searchMap.createtime" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
             <el-form-item >
                <el-button type="primary" @click="search()">查询</el-button>
            </el-form-item>-->
            <el-form-item >
                <el-button type="primary" size="small" @click="dialogFormVisible = true;pojo={};id=null">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="list" style="width: 100%">
            <el-table-column prop="gid" label="群组号"></el-table-column>
            <el-table-column prop="groupname" label="群组名称"></el-table-column>
            <el-table-column label="创建人">
                <template slot-scope="scope">
                    {{scope.row.createuname}}
                </template>
            </el-table-column>
            <el-table-column label="群组成员">
                <template slot-scope="scope">
                    {{scope.row.groupmembersname}}
                </template>
            </el-table-column>
            <el-table-column prop="createtime" label="创建时间"></el-table-column>
            <el-table-column prop="updatetime" label="修改时间"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column fixed="right" label="操作" align="center" with="180">
                <template slot-scope="scope">
                    <template v-if="roles.indexOf('1')>-1">
                        <el-button @click="deleteById(scope.row.id)" type="danger" size="mini">删除</el-button>
                    </template>
                    <template v-else>
                        <template v-if="UID===scope.row.createuserid">
                            <el-button @click="findById(scope.row.id)" type="primary" size="mini">修改</el-button>
                            <el-button @click="deleteById(scope.row.id)" type="danger" size="mini">删除</el-button>
                        </template>
                        <template v-else>
                            <el-button @click="joinGroup(scope.row.id)" :disabled="ifBeyondGroup(scope.row)" :type="ifBeyondGroup(scope.row)?'info':'primary'" size="mini">{{ifBeyondGroup(scope.row)?'已加入':'加入群组'}}</el-button>
                            <el-button v-if="ifBeyondGroup(scope.row)" @click="outById(UID,scope.row.id,true)" type="danger" size="mini">退群</el-button>
                        </template>
                    </template>
                    <el-popover v-if="roles.indexOf('1')>-1 || UID===scope.row.createuserid || ifBeyondGroup(scope.row) && scope.row.userGs"
                        placement="left-start" width="600" trigger="click">
                        <el-table :data="scope.row.userGs">
                            <el-table-column property="username" label="姓名"></el-table-column>
                            <el-table-column property="telno" label="电话"></el-table-column>
                            <el-table-column property="addr" label="籍贯"></el-table-column>
                            <el-table-column property="remark" label="备注"></el-table-column>
                            <el-table-column label="操作" v-if="UID===scope.row.createuserid">
                                <template slot-scope="scope2">
                                    <el-button @click="outById(scope2.row.id,scope.row.id)" type="text" :style="scope.row.createuserid === scope2.row.id ? 'color: #c8c9cc' : 'color: #f56c6c'" :disabled="scope.row.createuserid === scope2.row.id">移除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button slot="reference" type="primary" size="mini">查看组员信息</el-button>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>

        <!--添加分页组件,显示页码
            @size-change:每页查询条数发生改变时,调用的js代码
            @current-change:每页的页码发生变化时,调用的js代码
            : 开头: 表示使用data中的数据
            :current-page.sync: 当前的页码
            :page-sizes: 每页显示的条数的调整
            :page-size: 默认显示的条数
            :total: 总记录条数
        -->
        <el-pagination @size-change="currentPageSize" @current-change="search"
                    :current-page.sync="page" :page-sizes="[5, 10, 20, 30]"
                    :page-size="size" layout="total, sizes, prev, pager, next" :total="total">
        </el-pagination>

         <!-- 新增活动的弹出框代码
        :visible.sync: 属性值是data里的一个属性,控制页面是否显示
        label-width="80px" : 描述信息和输入框在一行显示
    -->
    <el-dialog title="新增缴费群组" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form label-width="100px" :model="pojo" :rules="pojoRules" ref="pojo">
            <el-form-item label="群组名称" prop="groupname">
                <el-input v-model="pojo.groupname"></el-input>
            </el-form-item>
            <el-form-item label="群组密钥" prop="grouppwd">
                <el-input v-model="pojo.grouppwd" type="password"></el-input>
            </el-form-item>
            <el-form-item v-if="!id" label="创建人" prop="createuserid">{{name}}</el-form-item>
            <el-form-item v-if="id" label="修改人" prop="updateuserid">{{name}}</el-form-item>
            <el-form-item label="备注">
                <el-input v-model="pojo.remark"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
    </el-dialog>
    </div>
</template>

<script>
import groupApi from "@/api/group"
import { strToArr, arrToStr } from '@/utils'

export default {
    data() {
        return {
            list:null,
            searchMap:{},
            dialogFormVisible :false,
            pojo: {
                groupname: '',
                grouppwd: ''
            },
            pojoRules: {
                groupname: [
                    { required: true, message: '请输入群组名称', trigger: 'blur' }
                ],
                grouppwd: [
                    { required: true, message: '请输入群组密钥', trigger: 'blur' }
                ]
            },
            id:null,
            page:1,
            size:10,
            total:0
        }
    },
    computed:{
        roles() {
            return this.$store.getters.roles
        },
        name() {
            return this.$store.getters.name
        },
        UID() {
            return this.$store.getters.userid
        }
    },
    created() {
        this.search()
    },
    methods: {
        saveOrUpdate() {
            this.$refs['pojo'].validate((valid) => {
                if (valid) {
                    if(this.id) {
                        this.pojo.updateuserid = this.UID
                    }else{
                        this.pojo.createuserid = this.UID
                        this.pojo.groupmembers = this.UID
                    }
                    groupApi.saveOrUpdate(this.id,this.pojo).then( response => {
                        this.$message({
                            showClose: true,
                            message: response.message,
                            type: response.flag?'success':'error'
                        });
                        //保存成功(flag=true),关闭弹出框,并刷新列表
                        if(response.flag){
                            this.dialogFormVisible = false  //关闭弹出框
                            this.search()
                        }
                    })
                } else {
                    return false
                }
            })
        },
        findById(id) {
            this.id = id;
            groupApi.findById(id).then(response => {
                this.pojo = response.data;
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
                groupApi.deleteById(id).then( response => {
                    this.$message({
                        showClose: true,
                        message: response.message,
                        type: response.flag?'success':'error'
                        });
                    if(response.flag){
                        this.search()
                    }
                })  
            })  
        },
        //分页查询的方法
        async search() {
            let response = await groupApi.search({
                userid: this.UID,
                pageIndex: this.page,
                pageSize: this.size
            })
            if (response.flag && response.data) {
                const $info = response.data.rows
                if ( $info.length > 0){
                    for (let i = 0; i < $info.length; ++i) {
                        $info[i].userGs = [];
                        let res = await groupApi.findAllUserById($info[i].id)
                        if (res.flag && res.data) {
                            $info[i].userGs = res.data
                        }
                    }
                    this.list = $info
                    this.total = response.data.total
                }
            }
        },
        currentPageSize(val){
            this.size = val
            this.search()
        },
        joinGroup(id) {
            this.$prompt('请输入群组密钥', '提示', {
            }).then(({ value }) => {
                groupApi.joinGroup({
                    userid: this.UID,
                    groupid: id,
                    grouppwd: value
                }).then( response => {
                    this.$message({
                        showClose: true,
                        message: response.message,
                        type: response.flag?'success':'error'
                    });
                    if(response.flag){
                        this.search()
                    }
                })
            }).catch(err=>{})
        },
        outById(id, gid,flag) {
            var msg = ''
            if (flag) {
                msg = '确定退群?'
            } else {
                msg = '确定移除?'
            }
            this.$confirm(msg, '提示', {
            type: 'warning'
            }).then(() => {
                groupApi.outGroup(id,gid).then( response => {
                    this.$message({
                        showClose: true,
                        message: response.message,
                        type: response.flag?'success':'error'
                        });
                    if(response.flag){
                        this.search()
                    }
                })  
            })  
        },
        ifBeyondGroup(row) {
            if (row.groupmembers) {
                const uarr = strToArr(row.groupmembers)
                return uarr.indexOf(this.UID) > -1 || false
            }
        }
    }
}
</script>

