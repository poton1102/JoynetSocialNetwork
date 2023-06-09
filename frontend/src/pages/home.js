import React from 'react'
import Status from '../components/home/Status'
import Posts from '../components/home/Posts'
import { useSelector } from 'react-redux'
import LoadIcon from '../images/loading.gif'
import RightSideBar from '../components/home/RightSideBar'
import LeftSideBar from '../components/home/LeftSideBar'
const Home = () => {
    const { homePosts } = useSelector(state => state)

    return (
        <div className="home mt-70 row main1">
            <div className="col-md-3 mt-70">
                <LeftSideBar />
            </div>

            <div className="col-md-6 mt-70">
                <Status />
                {
                    homePosts.loading
                        ? <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
                        : (homePosts.result === 0 && homePosts.posts.length === 0)
                            ? <h2 className="text-center">Không có bài viết</h2>
                            : <Posts />
                }

            </div>

            <div className="col-md-3 mt-70">
                <RightSideBar />
            </div>
        </div>
    )
}

export default Home
