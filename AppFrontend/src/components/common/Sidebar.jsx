import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  IconButton,
  Avatar,
  Divider,
  useMediaQuery,
  Collapse,
  Tooltip,
  alpha,
  Chip,
  Button,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useAuth } from "../../auth/AuthContext";

// Drawer width for different states
const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

// Styled components for the sidebar
const SidebarHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  ...theme.mixins.toolbar,
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('background-color', {
    duration: theme.transitions.duration.shorter,
  }),
  ...(active && {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
  }),
  '&:hover': {
    backgroundColor: active 
      ? alpha(theme.palette.primary.main, 0.15) 
      : alpha(theme.palette.primary.main, 0.05),
  },
}));

const Sidebar = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpenStates, setMenuOpenStates] = useState({});
  
  // Close drawer on mobile when location changes
  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  // Handle responsive drawer
  useEffect(() => {
    if (!isMobile && !drawerOpen) {
      setDrawerOpen(true);
      setCollapsed(false);
    }
  }, [isMobile]);
  
  const handleDrawerToggle = () => {
    if (isMobile) {
      setDrawerOpen(!drawerOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  const toggleSubMenu = (menuId) => {
    setMenuOpenStates(prev => ({
      ...prev, 
      [menuId]: !prev[menuId]
    }));
  };
  
  // Get navigation links based on user role
  const getNavLinks = () => {
    const links = [
      { id: 'home', label: "Home", icon: <HomeIcon />, path: "/" },
    ];
    
    if (user) {
      // Use different dashboard routes based on user role
      if (user.role === "jobSeeker") {
        links.push({ id: 'dashboard', label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" });
      } else if (user.role === "recruiter") {
        links.push({ id: 'dashboard', label: "Dashboard", icon: <DashboardIcon />, path: "/recruiter-dashboard" });
      }
    
      if (user.role === "jobSeeker") {
        links.push({ 
          id: 'jobs',
          label: "Jobs", 
          icon: <WorkIcon />, 
          path: "/jobs",
          subMenu: [
            { id: 'browse-jobs', label: "Browse Jobs", path: "/jobs" },
            { id: 'saved-jobs', label: "Saved Jobs", path: "/saved-jobs" },
            { id: 'applied-jobs', label: "Applied Jobs", path: "/applied-jobs" },
          ]
        });
      } else if (user.role === "recruiter") {
        // Recruiter navigation based on AppRoutes.jsx
        links.push({ 
          id: 'recruiter-jobs',
          label: "Jobs",
          icon: <WorkIcon />,
          path: "/recruiter-job",
          subMenu: [
            { id: 'view-jobs', label: "View Jobs", path: "/recruiter-job" },
            { id: 'post-job', label: "Post New Job", path: "/recruiter-dashboard/new-job" }, 
            { id: 'match-applicants', label: "Match Applicants", path: "/recruiter-dashboard/match-applicants" },
          ]
        });
        
        
        links.push({ 
          id: 'company-management', 
          label: "Company", 
          icon: <BusinessIcon />, 
          path: "/companies",
          subMenu: [
            { id: 'view-company', label: "View Company", path: "/companies" },
            { id: 'create-company', label: "Create Company", path: "/companies/create" },
          ]
        });
      }
    } else {
      links.push({ id: 'jobs-public', label: "Jobs", icon: <WorkIcon />, path: "/jobs" });
      links.push({ id: 'companies-public', label: "Companies", icon: <BusinessIcon />, path: "/companies" });
    }
    
    return links;
  };
  
  const navLinks = getNavLinks();
  
  // Render nav link with active state highlight
  const renderNavLink = (link, index) => {
    const isActive = location.pathname === link.path || 
                     (link.subMenu && link.subMenu.some(item => location.pathname === item.path));
    const hasSubMenu = link.subMenu && link.subMenu.length > 0;
    const showSubMenu = hasSubMenu && (isActive || menuOpenStates[link.id]);
    
    return (
      <React.Fragment key={link.id || index}>
        <StyledListItem
          component={hasSubMenu ? 'div' : RouterLink}
          to={hasSubMenu ? undefined : link.path}
          onClick={hasSubMenu ? () => toggleSubMenu(link.id) : undefined}
          active={isActive ? 1 : 0}
        >
          <ListItemIcon sx={{ 
            minWidth: collapsed ? 'auto' : 56, 
            color: isActive ? 'primary.main' : 'text.secondary',
            transition: theme.transitions.create('color')
          }}>
            {link.icon}
          </ListItemIcon>
          {(!collapsed || isMobile) && (
            <>
              <ListItemText 
                primary={link.label} 
                primaryTypographyProps={{ 
                  fontWeight: isActive ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
                  color: isActive ? 'primary.main' : 'text.primary',
                }}
              />
              {hasSubMenu && (menuOpenStates[link.id] ? <ExpandLess /> : <ExpandMore />)}
            </>
          )}
        </StyledListItem>
        
        {hasSubMenu && (!collapsed || isMobile) && (
          <Collapse in={showSubMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {link.subMenu.map((subItem, subIndex) => {
                const isSubActive = location.pathname === subItem.path;
                return (
                  <StyledListItem
                    key={subItem.id || subIndex}
                    component={RouterLink}
                    to={subItem.path}
                    active={isSubActive ? 1 : 0}
                    sx={{ pl: 4 }}
                    button
                  >
                    <ListItemText 
                      primary={subItem.label} 
                      primaryTypographyProps={{ 
                        fontWeight: isSubActive ? theme.typography.fontWeightBold : theme.typography.fontWeightRegular,
                        fontSize: '0.9rem',
                        color: isSubActive ? 'primary.main' : 'text.secondary',
                      }}
                    />
                  </StyledListItem>
                );
              })}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };
  
  const drawerContent = (
    <>
      <SidebarHeader>
        {(!collapsed || isMobile) ? (
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ 
              fontWeight: 700, 
              color: 'primary.main', 
              textDecoration: 'none',
            }}
          >
            JobAlign
          </Typography>
        ) : (
          <Avatar
            sx={{ 
              bgcolor: 'primary.light',
              color: 'primary.dark',
              width: 35,
              height: 35,
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            JA
          </Avatar>
        )}
        
        <IconButton 
          onClick={handleDrawerToggle} 
          aria-label={drawerOpen ? "Collapse sidebar" : "Expand sidebar"}
          size="small"
          sx={{ color: 'primary.main' }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </SidebarHeader>
      
      <Divider sx={{ mx: 2, borderColor: 'secondary.light' }} />
      
      {/* User Profile Section */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        {user ? (
          <Box 
            component={RouterLink}
            to="/profile"
            sx={{ 
              display: 'block',
              textAlign: 'center',
              borderRadius: theme.shape.borderRadius,
              textDecoration: 'none',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.light, 0.1),
              }
            }}
          >
            {(!collapsed || isMobile) ? (
              <>
                <Avatar
                  src={user.photoURL || user.profilePicture}
                  alt={user.displayName || user.fullName || "User"}
                  sx={{ 
                    width: 80, 
                    height: 80,
                    mx: 'auto',
                    mb: 1,
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    bgcolor: theme.palette.primary.light,
                    color: theme.palette.primary.main,
                    boxShadow: theme.shadows[2],
                  }}
                >
                  {(user.displayName || user.fullName || "U").charAt(0)}
                </Avatar>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                    lineHeight: 1.2
                  }}
                >
                  {user.displayName || user.fullName || "User"}
                </Typography>
                
                <Chip
                  label={user.role === "jobSeeker" ? "Job Seeker" : "Recruiter"}
                  size="small"
                  sx={{
                    mt: 0.5,
                    fontSize: '0.75rem',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                  }}
                />
              </>
            ) : (
              <Tooltip title={`View Profile: ${user.displayName || user.fullName || "User"}`} placement="right">
                <Avatar
                  src={user.photoURL || user.profilePicture}
                  alt={user.displayName || user.fullName || "User"}
                  sx={{ 
                    width: 40, 
                    height: 40,
                    mx: 'auto',
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    bgcolor: theme.palette.primary.light,
                    color: theme.palette.primary.main,
                  }}
                >
                  {(user.displayName || user.fullName || "U").charAt(0)}
                </Avatar>
              </Tooltip>
            )}
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button 
              variant="outlined" 
              fullWidth
              component={RouterLink} 
              to="/login"
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  borderColor: theme.palette.primary.dark,
                }
              }}
            >
              Login
            </Button>
            <Button 
              variant="contained" 
              fullWidth
              component={RouterLink} 
              to="/register"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                }
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Box>
      
      {user && <Divider sx={{ my: 2, mx: 2, borderColor: 'secondary.light' }} />}
      
      <List component="nav" sx={{ px: 1 }}>
        {navLinks.map(renderNavLink)}
        
        
        {user && (
          <>
            <Divider sx={{ my: 1, mx: 2, borderColor: 'secondary.light' }} />
            <StyledListItem 
              component="button" 
              onClick={handleLogout}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 56, color: 'error.main' }}>
                <LogoutIcon />
              </ListItemIcon>
              {(!collapsed || isMobile) && <ListItemText primary="Logout" sx={{ color: 'error.main' }} />}
            </StyledListItem>
          </>
        )}
      </List>
    </>
  );
  
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile drawer toggle button - only visible when drawer is closed */}
      {isMobile && !drawerOpen && (
        <IconButton
          color="primary"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 10,
            left: 10,
            zIndex: theme.zIndex.drawer + 2,
            bgcolor: 'primary.main',
            color: '#fff',
            boxShadow: theme.shadows[3],
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      
      {/* Mobile drawer - temporary variant */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRight: '1px solid',
              borderColor: 'secondary.light',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        // Desktop drawer - persistent variant
        <Drawer
          variant="permanent"
          open={!collapsed}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
              overflow: collapsed ? 'visible' : 'auto',
              bgcolor: 'background.default',
              borderRight: '1px solid',
              borderColor: 'secondary.light',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH}px)` },
          ml: { md: collapsed ? `${COLLAPSED_WIDTH}px` : `${DRAWER_WIDTH}px` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar; 