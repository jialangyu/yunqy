<template>
    <div>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item v-if="roles.indexOf('1')>-1">
                <el-button type="primary" size="small" @click="dialogFormVisible = true;pojo={};id=null">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="list" style="width: 100%">
            <el-table-column prop="username" label="用户名称" with="50"></el-table-column>
            <el-table-column prop="telno" label="用户电话" with="50"></el-table-column>
            <el-table-column prop="addr" label="用户籍贯" with="50"></el-table-column>
            <el-table-column prop="createtime" label="创建时间" with="280"></el-table-column>
            <el-table-column prop="updatetime" label="更新时间" with="280"></el-table-column>
            <el-table-column prop="remark" label="备注" with="180"></el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="240" v-if="roles.indexOf('1')>-1">
                <template slot-scope="scope">
                    <el-button @click="findById(scope.row.id)" type="primary" size="mini">修改</el-button>
                    <el-button @click="deleteById(scope.row.id)" type="danger" size="mini">删除</el-button>
                    <el-button @click="resetById(scope.row.id)" type="warning" size="mini">重置密码</el-button>
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
    <el-dialog title="新增用户" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form label-width="100px">
            <el-form-item label="用户名" >
                <el-input v-model="pojo.username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话号" >
                <el-input v-model="pojo.telno" auto-complete="off"></el-input>
            </el-form-item>
            <!-- <el-form-item label="登录密码" >
                <el-input v-model="pojo.password" auto-complete="off"></el-input>
            </el-form-item> -->
            <el-form-item label="籍贯" >
                <el-input v-model="pojo.addr" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="性别" >
                <el-radio v-model="pojo.sex" label="男">男</el-radio>
                <el-radio v-model="pojo.sex" label="女">女</el-radio>
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
    </div>
</template>

<script>
import userApi from "@/api/user"

export default {
    data() {
        return {
            list:null,
            searchMap:{},
            typeList :null,
            dialogFormVisible :false,
            pojo:{},
            userList:null,
            id:null,
            page:1,
            size:10,
            total:0
        }
    },
    computed:{
        roles() {
            return this.$store.getters.roles
        }
    },
    created() {
        this.search()
    },
    methods: {
        fetchData() {
            userApi.getList().then(response => {
                this.list = response.data;
            })
        } ,
        //保存新增活动
        saveOrUpdate() {
            userApi.saveOrUpdate(this.id,this.pojo).then( response => {
                this.$message({
                    showClose: true,
                    message: response.message,
                    type: response.flag?'success':'error'
                });
                //保存成功(flag=true),关闭弹出框,并刷新列表
                if(response.flag){
                    this.dialogFormVisible = false  //关闭弹出框
                    this.search()             //再次加载活动列表
                    this.$store.dispatch('getDictuList')
                }
            })       
        },
        findById(id) {
            this.id = id;
            userApi.findById(id).then(response => {
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
                userApi.deleteById(id).then( response => {
                    this.$message({
                        showClose: true,
                        message: response.message,
                        type: response.flag?'success':'error'
                        });
                    if(response.flag){
                        this.search() ;    //如果删除执行成功,重新加载页面
                        this.$store.dispatch('getDictuList')
                    }
                })  
            })  
        },
        resetById(id) {
            this.$confirm('确定要重置该用户密码?', '提示', {
            type: 'warning'
            }).then(() => {
                userApi.resetById(id).then( response => {
                    this.$message({
                        showClose: true,
                        message: response.message,
                        type: response.flag?'success':'error'
                        });
                })  
            })  
        },
        //分页查询的方法
        search() {
            userApi.search(this.page,this.size).then( response => {
                this.list = response.data.rows //获取列表数据
                this.total = response.data.total
            })
        },
        currentPageSize(val){
            this.size = val
            this.search()
        }    
    }
}
</script>

