
const getPosts = (amount) => {
    // const url = "https://jsonplaceholder.typicode.com/posts"
    // const resp = await fetch(url)
    // const posts = await resp.json()
    // return posts.filter(post => post.id % 2 === 0)

    console.log('getPosts [' + amount + ']')
    const newPosts = []
    for (let index = 0; index < amount; index++) {
        let postId = Math.floor(Math.random() * 500000) + 1
        const newPost = {
            id: postId,
            title: `title of post: ` + postId
        }
        newPosts.push(newPost)
    }
    return newPosts
}

export default getPosts
