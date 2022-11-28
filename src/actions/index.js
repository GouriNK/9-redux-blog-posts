import jsonPlaceholder from "../api/jsonPlaceholder";
import _ from 'lodash';

export const fetchPosts = () => async (dispatch) => {
    const response = await jsonPlaceholder.get('/posts');

    console.log(response.data);

    dispatch({
        type : 'FETCH_POSTS',
        payload : response.data
    });
}

// ** NON-MEMOIZED VERSION **
// export const fetchUser = (userId) => async (dispatch) => {
//     const response = await jsonPlaceholder.get(`/users/${userId}`);

//     console.log(response.data);

//     dispatch({
//         type : 'FETCH_USER',
//         payload : response.data
//     });
// }

// ** MEMOIZED VERSION ** (downside is that data changes will not be re-fetched)
export const fetchUser = userId => dispatch => {
    _fetchUser(userId, dispatch);
};

// memoize is a function from lodash that ensures that 
// the fetchUser function is called only once per userId
// eg: fetchUser(4) is called only once. if fetchUser(4) is called aagin, no call is executed.
const _fetchUser = _.memoize(async (userId, dispatch)=>{
    const response = await jsonPlaceholder.get(`/users/${userId}`);

    console.log(response.data);

    dispatch({
        type : 'FETCH_USER',
        payload : response.data
    });
});
    

export const fetchPostsAndUsers = () => async (dispatch, getState) =>{
    await dispatch(fetchPosts());
    // const userIds = _.uniq(_.map(getState().posts, 'userId'));
    // console.log(userIds);
    // userIds.forEach(id => dispatch(fetchUser(id)));

    // OR SAME AS below

    _.chain(getState().posts)
        .map('userId')
            .uniq()
                .forEach(id => dispatch(fetchUser(id)))
                    .value();
}
