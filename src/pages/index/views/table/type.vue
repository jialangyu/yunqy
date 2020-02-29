<template>
    <div>
         <el-form :inline="true" class="demo-form-inline"  v-if="roles.indexOf('1')>-1">
            <!--<el-form-item label="缴费类型">
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
            <el-table-column prop="typename" label="类型名称" with="50"></el-table-column>
            <el-table-column prop="createtime" label="创建时间" with="280"></el-table-column>
            <el-table-column prop="updatetime" label="修改时间" with="280"></el-table-column>
            <el-table-column prop="remark" label="备注" with="320"></el-table-column>
            <el-table-column fixed="right" label="操作" align="center" with="150" v-if="roles.indexOf('1')>-1">
                <template slot-scope="scope">
                    <el-button @click="findById(scope.row.id)" type="primary" size="mini">修改</el-button>
                    <el-button @click="deleteById(scope.row.id)" type="danger" size="mini">删除</el-button>
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
    <el-dialog title="新增缴费类型" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form label-width="100px">
            <el-form-item label="类型名称" >
                <el-input v-model="pojo.typename" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item v-if="!id" label="创建人" prop="userid">{{name}}</el-form-item>
            <el-form-item v-if="id" label="修改人" prop="updatetypeuid">{{name}}</el-form-item>
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
import typeApi from "@/api/type"

export default {
    data() {
        return {
            list:null,
            searchMap:{},
            dialogFormVisible :false,
            pojo:{},
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
        //保存新增活动
       saveOrUpdate() {
            if(this.id) {
                this.pojo.updatetypeuid = this.UID
            }else{
                this.pojo.userid = this.UID
            }            
            typeApi.saveOrUpdate(this.id,this.pojo).then( response => {
                this.$message({
                    showClose: true,
                    message: response.message,
                    type: response.flag?'success':'error'
                });
                //保存成功(flag=true),关闭弹出框,并刷新列表
                if(response.flag){
                    this.dialogFormVisible = false  //关闭弹出框
                    this.search()              //再次加载活动列表
                    this.$store.dispatch('getDictType')
                }
            })       
        },
        findById(id) {
            this.id = id;
            typeApi.findById(id).then(response => {
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
                typeApi.deleteById(id).then( response => {
                    this.$message({
                        showClose: true,
                        message: response.message,
                        type: response.flag?'success':'error'
                        });
                    if(response.flag){
                        this.search() ;    //如果删除执行成功,重新加载页面
                        this.$store.dispatch('getDictType')
                    }
                })  
            })  
        },
        //分页查询的方法
        search() {
            typeApi.search(this.page,this.size).then( response => {
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

