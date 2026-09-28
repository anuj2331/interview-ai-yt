import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../features/auth/hooks/useAuth'
import { useNavigate } from 'react-router'

const ProfileMenu = () => {
    const { user, handleLogout } = useAuth()
    const [ open, setOpen ] = useState(false)
    const menuRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (!user) return null

    const initial = user.username ? user.username[ 0 ].toUpperCase() : (user.email ? user.email[ 0 ].toUpperCase() : 'U')
    const displayName = user.username || user.email

    const onLogout = async () => {
        try {
            setOpen(false)
            await handleLogout()
            navigate('/login')
        } catch (err) {
            console.error("Logout error", err)
        }
    }

    return (
        <div className="profile-menu-container" ref={menuRef}>
            <button
                className={`profile-menu-trigger ${open ? 'active' : ''}`}
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                title="Account Profile & Settings"
            >
                <span className="profile-avatar">{initial}</span>
                <span className="profile-name">{displayName}</span>
                <svg className={`chevron-icon ${open ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {open && (
                <div className="profile-dropdown-card">
                    <div className="dropdown-header">
                        <div className="dropdown-avatar">{initial}</div>
                        <div className="dropdown-user-details">
                            <span className="dropdown-username">{displayName}</span>
                            {user.email && <span className="dropdown-email">{user.email}</span>}
                        </div>
                    </div>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout-item" onClick={onLogout}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Log Out</span>
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfileMenu
