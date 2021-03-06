const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  userid: state => state.user.userid,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  uListArrs: state => state.dict.uListArrs,
  typeArrs: state => state.dict.typeArrs
}
export default getters
