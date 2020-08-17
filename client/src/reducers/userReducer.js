export const initialState = null

export const reducer = (state, action) => {
  switch (action.type) {
    case "USER":
      return action.payload
    case "UPDATE":
      return {
        ...state,
        followers : action.payload.followers,
        following : action.payload.following
      }
    case "UPDATE_PHOTO":
      return {
        ...state,
        photo : action.payload.photo
      }
    case "CLEAR":
      return null
    default:
      return state
  }
}