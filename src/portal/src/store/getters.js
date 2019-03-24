const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userId: state => state.user.userId,
  name: state => state.user.name,
  roles: state => state.user.roles,
  localtion: state => state.amap.localtion
}
export default getters
