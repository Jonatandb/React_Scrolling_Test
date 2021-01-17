import { useEffect, useState, useRef } from "react";
import getPosts from './getPosts'
//https://stackoverflow.com/questions/45585542/detecting-when-user-scrolls-to-bottom-of-div-with-react-js/49573628#:~:text=An%20even%20simpler%20way%20to,you've%20reached%20the%20bottom!&text=In%20react%2C%20just%20add%20an,scrollable%20element%2C%20and%20use%20event.
import { debounce } from 'lodash'

function App() {
  const [posts, setPosts] = useState([])
  const [postsToGet, setPostsToGet] = useState(10)
  const [scrollData, setScrollData] = useState(null)
  const chatDivRef = useRef()

  useEffect(() => {
    console.log('useEffect [posts:' + posts.length + ', scrollData: ' + JSON.stringify(scrollData) + ']',)
    if (posts.length !== postsToGet) {
      console.log('\tpido ' + postsToGet + ' posts')
      setPosts(getPosts(postsToGet))
      const { scrollHeight, scrollTop, clientHeight } = chatDivRef.current
      console.log('\tguardo scroll data:', scrollHeight, scrollTop, clientHeight)
      setScrollData({ scrollHeight, scrollTop, clientHeight, previousMessages: posts.length })
      return
    }
    if ((!scrollData || (scrollData.scrollHeight === 0 && scrollData.scrollTop === 0)) && chatDivRef.current.clientHeight !== chatDivRef.current.scrollHeight) {
      console.log('\thay barra de scroll pero no se scrolleó nunca, seteo scroll abajo de todo')
      chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight
    } else if (scrollData) {
      // o llegaron posts o se movió el scroll

      // estaban arriba de todo
      if (scrollData.scrollTop === 0) {
        if (posts.length === (scrollData.previousMessages + 10)) {
          chatDivRef.current.scrollTop = scrollData.scrollTop + (chatDivRef.current.scrollHeight - scrollData.scrollHeight)
        } else {
          console.log('\tpedi mensajes porque el scroll estaba arriba')
          setPostsToGet((currentPostsToGet) => currentPostsToGet + 10)
        }
      }

      // estaban en el medio

      // estaban abajo de todo
      const bottom = scrollData.scrollHeight - scrollData.scrollTop === scrollData.clientHeight;
      if (bottom) {
        if (postsToGet !== 10) {
          setPostsToGet(10)
        }
      }
    }
  }, [posts, scrollData, postsToGet])

  const debouncedHandleScroll = debounce((e) => {
    console.log('handleScroll')
    const { scrollHeight, scrollTop, clientHeight } = e.target
    console.log('\tguardo scroll data:', scrollHeight, scrollTop, clientHeight)
    setScrollData({ scrollHeight, scrollTop, clientHeight, previousMessages: posts.length })
  },
    400,
    { leading: false, trailing: true })

  console.log('render() -> posts:', posts.length)
  return (
    <div>
      <div
        ref={chatDivRef}
        onScroll={debouncedHandleScroll}
        style={{ maxHeight: 200, backgroundColor: 'gray', overflowY: 'scroll' }}
      >
        {posts.map(post => <p key={post.id}>{post.id} - {post.title}</p>)}
      </div>
    </div>
  );
}

export default App;
