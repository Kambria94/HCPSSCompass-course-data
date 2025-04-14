// HomeView component mirroring the iOS app
const { useState, useEffect } = React;

// Button categories - match the iOS app's categories
const ButtonCategory = {
    INFORMATION: 'information',
    COURSES: 'courses',
    PLANNING: 'planning',
    SUPPORT: 'support'
};

// HomeButtonView component - equivalent to the iOS HomeButtonView
function HomeButtonView({ title, icon, category, onClick }) {
    return (
        <div className={`home-button ${category}`} onClick={onClick}>
            {/* Lighting effect */}
            <div className="lighting-effect"></div>
            
            {/* Decorative circle */}
            <div className="button-circle"></div>
            
            {/* Button content */}
            <i className={`home-button-icon fas ${icon}`}></i>
            <div className="home-button-title">{title}</div>
        </div>
    );
}

// Main HomeView component
function HomeView({ darkMode }) {
    // State for auth status (simplified for demo)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    // Background circles for decoration
    const decorativeCircles = [
        { size: '30vw', color: '#3498db', x: '-20vw', y: '-15vh', blur: '30px' },
        { size: '40vw', color: '#2ecc71', x: '25vw', y: '25vh', blur: '40px' },
        { size: '50vw', color: '#9b59b6', x: '-5vw', y: '40vh', blur: '50px' },
        { size: '60vw', color: '#f1c40f', x: '30vw', y: '-10vh', blur: '60px' },
        { size: '45vw', color: '#e74c3c', x: '-25vw', y: '10vh', blur: '45px' },
        { size: '55vw', color: '#34495e', x: '20vw', y: '50vh', blur: '55px' },
    ];
    
    // Simulate profile login
    const handleProfileClick = () => {
        if (!isAuthenticated) {
            setIsAuthenticated(true);
            setUserProfile({ name: 'John Doe' });
        }
    };
    
    return (
        <div className="app-container">
            {/* Background gradient */}
            <div className="bg-gradient"></div>
            
            {/* Decorative circles */}
            {decorativeCircles.map((circle, index) => (
                <div
                    key={index}
                    className="decorative-circle"
                    style={{
                        width: circle.size,
                        height: circle.size,
                        background: `${circle.color}${darkMode ? '20' : '30'}`,
                        left: circle.x,
                        top: circle.y,
                        filter: `blur(${circle.blur})`
                    }}
                ></div>
            ))}
            
            {/* Header Banner */}
            <div className="header-banner">
                {/* Title */}
                <div className="header-content">
                    <div className="app-title">HCPSS Compass</div>
                    <div className="app-subtitle">Navigate Your Future</div>
                </div>
                
                {/* Profile button */}
                <button className="profile-button" onClick={handleProfileClick}>
                    {isAuthenticated && userProfile ? (
                        <>
                            <i className="fas fa-user-circle"></i>
                            <span>{userProfile.name}</span>
                        </>
                    ) : (
                        <>
                            <i className="fas fa-user-plus"></i>
                            <span>Sign In</span>
                        </>
                    )}
                </button>
            </div>
            
            {/* Main Content */}
            <div className="main-content">
                {/* Educational Resources Section */}
                <div className="section">
                    <div className="section-header">
                        <div className="section-title">Educational Resources</div>
                        <div className="section-dot"></div>
                    </div>
                    
                    <div className="grid">
                        <HomeButtonView
                            title="Course Catalog"
                            icon="fa-book"
                            category={ButtonCategory.COURSES}
                            onClick={() => window.location.href = 'courseCatalog.html'}
                        />
                        
                        <HomeButtonView
                            title="Career Academies"
                            icon="fa-briefcase"
                            category={ButtonCategory.COURSES}
                            onClick={() => window.location.href = 'careerAcademies.html'}
                        />
                        
                        <HomeButtonView
                            title="4-Year Plan"
                            icon="fa-calendar"
                            category={ButtonCategory.PLANNING}
                            onClick={() => {
                                if (!isAuthenticated) {
                                    handleProfileClick();
                                } else {
                                    window.location.href = 'fourYearPlan.html';
                                }
                            }}
                        />
                        
                        <HomeButtonView
                            title="Graduation Requirements"
                            icon="fa-check-circle"
                            category={ButtonCategory.PLANNING}
                            onClick={() => window.location.href = 'graduationRequirements.html'}
                        />
                    </div>
                </div>
                
                {/* Planning & Support Section */}
                <div className="section">
                    <div className="section-header">
                        <div className="section-title">Planning & Support</div>
                        <div className="section-dot"></div>
                    </div>
                    
                    <div className="grid">
                        <HomeButtonView
                            title="Career Readiness"
                            icon="fa-briefcase"
                            category={ButtonCategory.INFORMATION}
                            onClick={() => window.location.href = 'careerReadiness.html'}
                        />
                        
                        <HomeButtonView
                            title="Tutors"
                            icon="fa-users"
                            category={ButtonCategory.SUPPORT}
                            onClick={() => window.location.href = 'tutors.html'}
                        />
                        
                        <HomeButtonView
                            title="General Information"
                            icon="fa-info-circle"
                            category={ButtonCategory.INFORMATION}
                            onClick={() => window.location.href = 'generalInfo.html'}
                        />
                        
                        <HomeButtonView
                            title="Contact Us"
                            icon="fa-envelope"
                            category={ButtonCategory.SUPPORT}
                            onClick={() => window.location.href = 'contact.html'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 