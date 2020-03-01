<template>
  <div>
    <div class="projects" v-if="pojo && pojo.length">
      <div class="projects-item" v-for="(item, index) in pojo" :key="item.index" @click="clickCurGroup(item)">
        <div class="project-index-header" :style="itemBgStyle(index)">{{item.groupname}}</div>
        <div class="project-index-content">
            <div class="top-gm">
                <span>{{ item.createuserid | uInfo }}</span>
                <span class="gm-num"><svg-icon icon-class="user" />{{ item.groupmembers.length }}</span>
            </div>
            <div class="bot-gm">{{ item.createtime }}</div>
        </div>
      </div>
    </div>
    <div v-else class="nodata">暂无群组数据，您可以到 [缴费群组] 中创建或者加入相关群组……</div>
  </div>
</template>

<script>
import userApi from "@/api/user"
import { strToArr } from '@/utils'

export default {
    data() {
        return {
            pojo:{}
        }
    },
    computed: {
        UID() {
            return this.$store.getters.userid
        }
    },
    created() {
        this.findAllGroup()
    },
    methods: {
        findAllGroup() {
            userApi.findAllGroup(this.UID).then(response => {
                if (response.flag && response.data) {
                    for(let i = 0; i < response.data.length; i++) {
                        response.data[i].groupmembers = strToArr(response.data[i].groupmembers)
                    }
                    this.$nextTick(() => {
                        this.pojo = response.data;
                    })
                }
            })
        },
        clickCurGroup(val) {
            sessionStorage.setItem('GROUPName', val.groupname)
            this.$router.push({
                name: 'groupItem',
                query: {
                    id: val.id
                }
            })
        },
        itemBgStyle(index) {
            var colorList = ['#a2d148', '#7461c2', '#56b8eb', '#20bfa3', '#f28033']
            var ii = ''
            for (let i = 0; i < colorList.length; ++i) {
                if (index % colorList.length === i) {
                    ii = colorList[i]
                }
            }
            return `background: ${ii}`
        }
    }
}
</script>
<style lang="scss">
.projects{
    overflow: hidden;
    .projects-item{
        float: left;
        margin: 20px;
        width: 240px;
        height: 180px;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        border: 1px solid #e4e5e7;
        .project-index-header {
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 120px;
            color: #ffffff;
            text-align: center;
        }
        .project-index-content {
            font-size: 13px;
            color: #666;
            line-height: 22px;
            padding: 8px 15px;
            .top-gm{
                display: flex;
                justify-content: space-between;
                .gm-num{
                    color: #b0bec5;
                    .svg-icon{
                        font-size: 14px;
                    }
                }
            }
            .bot-gm{
                color: #b0bec5;
            }
        }
    }
}
</style>

