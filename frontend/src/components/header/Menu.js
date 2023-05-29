import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/actions/authAction'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import Avatar from '../Avatar'
import NotifyModal from '../NotifyModal'
// import NotifyModal from '../NotifyModal'

const Menu = () => {
    const { auth, theme, notify } = useSelector(state => state)
    const navLinks = [
        // { label: 'Reports', icon: 'report', path: '/reports', admin: true },
        { label: 'Home', icon: 'house', path: '/' },
        { label: 'Discover', icon: 'travel_explore', path: '/discover' },
        { label: 'Message', icon: 'forum', path: '/message' },

    ]

    if (auth.user.role === 'admin') {
        navLinks.unshift({ label: 'Reports', icon: 'report', path: '/reports' })
        // navLinks.unshift({ label: 'User management', icon: 'manage', path: '/usersmanage' })
    }

    const dispatch = useDispatch()
    const { pathname } = useLocation()

    const isActive = (pn) => {
        if (pn === pathname) return 'active'
    }

    return (
        <div className="menu">
            <ul className="navbar-nav flex-row">
                {/* {auth.user.role === 'admin' && (
                    <li className="nav-item px-2">
                        <Link className="nav-link" to="/reports">
                            <span className="material-icons home-icon">report</span>
                        </Link>
                    </li>
                )} */}

                {
                    navLinks.map((link, index) => (
                        (link.admin && !auth.admin) ? null : (
                            <li className={`nav-item px-2 ${isActive(link.path)}`} key={index}>
                                <Link className="nav-link" to={link.path}>
                                    <span className="material-icons home-icon" >{link.icon}</span>
                                </Link>
                            </li>
                        )
                    ))
                }

                <li className="nav-item dropdown" style={{ opacity: 1 }} >
                    <span className="nav-link position-relative" id="navbarDropdown"
                        role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                        <span className="material-icons home-icon"
                            style={{ color: notify.data.length > 0 ? '#0066ff' : '' }}>
                            notifications
                        </span>
                        {/* <span class="material-symbols-outlined">
                            favorite
                        </span> */}

                        <span className="notify_length">{notify.data.length}</span>
                    </span>

                    <div className="dropdown-menu" aria-labelledby="navbarDropdown"
                        style={{ transform: 'translateX(75px)' }}>
                        <NotifyModal />
                    </div>

                </li>


                <li className="nav-item dropdown" style={{ opacity: 1 }} >
                    <span className="nav-link dropdown-toggle" id="navbarDropdown"
                        role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <Avatar src={auth.user.avatar} size="medium-avatar" />
                    </span>

                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <Link className="dropdown-item" to={`/profile/${auth.user._id}`}>Profile</Link>

                        <label htmlFor="theme" className="dropdown-item d-none"
                            onClick={() => dispatch({
                                type: GLOBALTYPES.THEME, payload: !theme
                            })}>

                            {theme ? 'Light mode' : 'Dark mode'}
                        </label>

                        <div className="dropdown-divider"></div>
                        <Link className="dropdown-item" to="/"
                            onClick={() => dispatch(logout())}>
                            Logout
                        </Link>
                    </div>
                </li>
            </ul>
        </div>

    )
}

export default Menu
