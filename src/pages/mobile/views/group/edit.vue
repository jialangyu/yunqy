<template>
  <div class="main-con">
    <group>
      <x-input
        title="群组名称"
        v-model="pojo.groupname"
        placeholder="请输入群组名称"
        text-align="right"
        required
      ></x-input>
      <x-input
        title="群组密钥"
        type="password"
        v-model="pojo.grouppwd"
        placeholder="请输入群组密钥"
        text-align="right"
        required
      ></x-input>
    </group>
    <group>
      <cell :title="groupid?'修改人':'创建人'" :value="UName"></cell>
    </group>
    <group>
      <x-input title="备注" v-model="pojo.remark" placeholder="请输入备注信息" text-align="right"></x-input>
    </group>

    <box gap="60px 0">
      <x-button plain :disabled="sureDisable" @click.native="onSubmit">保存</x-button>
    </box>
  </div>
</template>

<script>
import groupApi from "@/api/group";
import { messageFun } from '@/utils/msg'
export default {
  data() {
    return {
      groupid: '',
      pojo: {}
    };
  },
  computed: {
    UID() {
      return this.$store.getters.userid;
    },
    UName() {
      return this.$store.getters.name;
    },
    sureDisable() {
      return !this.checkIsRequired() || false;
    }
  },
  created() {
    if (this.$route.query.id) {
      this.groupid = this.$route.query.id
      this.findById()
    }
  },
  methods: {
    checkIsRequired() {
      if (this.pojo.groupname && this.pojo.grouppwd) {
        return true;
      }
      return false;
    },
    onSubmit() {
      if (this.groupid) {
        this.pojo.updateuserid = this.UID;
      } else {
        this.pojo.createuserid = this.UID;
        this.pojo.groupmembers = this.UID;
      }
      groupApi.saveOrUpdate(this.groupid, this.pojo).then(response => {
        messageFun(response)
        if (response.flag) {
          this.$router.back(-1)
        }
      });
    },
    findById() {
      groupApi.findById(this.groupid).then(response => {
        this.pojo = response.data
      });
    }
  }
};
</script>
