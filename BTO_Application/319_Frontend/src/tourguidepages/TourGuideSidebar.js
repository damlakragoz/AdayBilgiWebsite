import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "../common/Sidebar.css";
import defaultProfilePicture from "../assets/default-profile-picture.jpg";

const TourGuideSidebar = ({ isOpen, toggleSidebar }) => {
    const [profilePictureUrl, setProfilePictureUrl] = useState(
        localStorage.getItem("profilePictureUrl") || "default-profile-picture.jpg"
    );
    const handleLogout = () => {
        localStorage.clear();
        setProfilePictureUrl(defaultProfilePicture);
        navigate("/login");
    };

    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="sidebar-header">
                <i className="fas fa-times close-icon" onClick={toggleSidebar}></i>
            </div>
            <ul className="nav flex-column">
                {/* Subtitle: Kullanıcı İşlemleri */}
                <li>
                    <Link to="/kullanici-islemleri" className="sidebar-subtitle">
                        <i className="fas fa-user-cog"></i> Kullanıcı İşlemleri
                    </Link>
                </li>
                <li>
                    <Link to="/tourguide-tourenrollment" className="nav-link text-white">
                        <i className="fas fa-calendar-alt"></i> Tur Takvimi - Başvur
                    </Link>
                </li>
                <li>
                    <Link to="/tourguide-all-fairs" className="nav-link text-white">
                        <i className="fas fa-briefcase"></i> Fuar Takvimi - Başvur
                    </Link>
                </li>
                <li>
                    <Link to="/tourguide-puantage" className="nav-link text-white">
                        <i className="fas fa-edit"></i> Puantaj - Aktivite Girişi
                    </Link>
                </li>

                <br/>
                {/* Subtitle: Bildirimler */}
                <li>
                    <Link to="/tourguide-notifications" className="sidebar-subtitle">
                        <i className="fas fa-bell"></i> Bildirimler
                    </Link>
                </li>
                <li>
                    <Link to="/tourguide-notifications" className="nav-link text-white">
                        <i className="fas fa-bell"></i> Bildirimlerim
                    </Link>
                </li>

                <br/>
                {/* Subtitle: Resources */}
                <hr/>
                {/* Settings and Logout */}
                <li>
                    <Link to="/tur-rehberi-ayarlar" className="nav-link text-white">
                        <i className="fas fa-cogs"></i> Ayarlar
                    </Link>
                </li>
                <li>
                    <a onClick={handleLogout} className="nav-link text-white">
                        <i className="fas fa-sign-out-alt"></i> Çıkış Yap
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default TourGuideSidebar;
