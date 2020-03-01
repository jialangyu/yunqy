import Vue from 'vue'
import { isMobile } from '@/utils'

export function messageFun(res) {
  if (isMobile()) {
    Vue.$vux.toast.show({
      text: res.message,
      type: res.flag ? '' : 'warn'
    })
  } else {
    Vue.$message({
      showClose: true,
      message: res.message,
      type: res.flag ? 'success' : 'error'
    })
  }
}
