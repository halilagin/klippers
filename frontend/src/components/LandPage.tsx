import React, { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Subscription from '@/pages/subscription';
import {
    Box,
    Container,
    Typography,
    Button,
    AppBar,
    Toolbar,
    Link,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    useTheme,
    useMediaQuery,
    Stack,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DescriptionIcon from '@mui/icons-material/Description';
import DevicesIcon from '@mui/icons-material/Devices';
import GroupsIcon from '@mui/icons-material/Groups';
import CloseIcon from '@mui/icons-material/Close';


const LandPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const threshold = 100;
            if (window.scrollY > threshold) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLoginClick = () => {
        console.log('Clicked to Sign In button!');
        navigate('/Login');
    };
    const handleSignUpClick = () => {
        console.log('Clicked to Sign Up button!');
        navigate('/subscription');
    };

    // Define nav links data
    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'Features', href: '#flexbox' },
        { name: 'Pricing', href: '#subscription' },
        { name: 'FAQ', href: '#faq' },
        { name: 'Contact', href: '#contact' },
    ];

    const drawerWidth = 240;

    const handleNavItemClick = () => {
        handleDrawerToggle();
    };

    // Define drawer content
    const drawer = (
        <Box sx={{ textAlign: 'center', width: drawerWidth, position: 'relative', pt: 2 }}>
            <IconButton
                aria-label="close drawer"
                onClick={() => { 
                    console.log('Close icon clicked!');
                    handleDrawerToggle(); 
                }}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon sx={{ fontSize: '1.25rem' }} />
            </IconButton>
            <List sx={{ pt: 4 }}>
                {navLinks.map((item) => (
                    <ListItem key={item.name} disablePadding>
                        <ListItemButton component={Link} href={item.href} sx={{ textAlign: 'center' }} onClick={handleNavItemClick}>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <Divider sx={{ my: 1 }}/>
                <ListItem disablePadding>
                    <ListItemButton sx={{ textAlign: 'center' }} onClick={() => { handleSignUpClick(); handleNavItemClick(); }}>
                        <ListItemText primary="Sign Up" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton sx={{ textAlign: 'center' }} onClick={() => { handleLoginClick(); handleNavItemClick(); }}>
                        <ListItemText primary="Log In" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ bgcolor: '#ffffff', overflowX: 'hidden', fontFamily: 'Inter, sans-serif' }}>
            <AppBar 
                position="absolute"
                sx={{ 
                    top: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'transparent', 
                    boxShadow: 'none', 
                    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                    mt: '24px',
                    zIndex: 1100,
                    '&.scrolled': { 
                        bgcolor: 'rgba(51, 51, 51, 0.9)', 
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                    }
                }} className="app-bar">
                <Toolbar sx={{
                    justifyContent: 'space-between',
                    px: { xs: 2, md: '5%' },
                    minHeight: { xs: 'auto', md: '64px' }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                            <Box 
                                className='oxlogo' 
                                sx={{ 
                                    width: { xs: '22vw', md: '10vw' }, 
                                    height: { xs: '17.6vw', md: '8vw' }, 
                                    maxWidth: { xs: 80, md: 100 }, 
                                    maxHeight: { xs: 64, md: 80 },
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate('/landpage')}
                            />
                            <Typography className='klippers' variant="h6" component="div" sx={{
                                fontWeight: 600,
                                color: '#141414',
                                fontSize: { xs: '18px', sm: '24px', md: 'clamp(18px, 3vw, 32px)' }
                            }}>
                                Klippers
                            </Typography>
                        </Box>
                    </Box>

                     <Box 
                         className={`heads ${isScrolled ? 'scrolled' : ''}`}
                         sx={{
                             display: { xs: 'none', md: 'flex' },
                             gap: { md: '2.5vw' },
                             bgcolor: 'rgba(247, 247, 247, 0.5)',
                             borderRadius: '32px',
                             p: { md: '2vh 2.5vw' },
                             alignItems: 'center',
                             position: 'fixed',
                             top: '30px',
                             left: '50%',
                             transform: 'translateX(-50%)',
                             zIndex: 1000,
                             boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                             transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                             '& a': {
                                 color: '#333',
                                 transition: 'color 0.3s ease'
                             },
                             '&.scrolled': {
                                 bgcolor: '#000000',
                                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                 '& a': {
                                     color: '#ffffff'
                                 }
                             }
                         }}>
                        {navLinks.map((link) => (
                            <Link href={link.href} key={link.name} sx={{ textDecoration: 'none', fontSize: 'clamp(13px, 1.2vw, 16px)', fontWeight: 300, '&:hover': { textDecoration: 'underline' } }}>
                                {link.name}
                            </Link>
                        ))}
                    </Box>

                     <Stack 
                         direction="row"
                         spacing={2}
                         sx={{
                             display: { xs: 'none', md: 'flex' },
                         }}
                     >
                         <Button variant="text" onClick={handleSignUpClick} sx={{
                             color: '#141414',
                             borderRadius: '23px',
                             textTransform: 'none',
                             fontSize: '16px',
                             fontWeight: 400,
                             bgcolor: 'transparent',
                             '&:hover': { 
                                 bgcolor: 'rgba(0, 0, 0, 0.04)',
                             }
                         }}>
                             Sign Up
                         </Button>
                         <Button variant="text"
                             onClick={handleLoginClick}
                             sx={{
                                 color: '#141414',
                                 borderRadius: '23px',
                                 textTransform: 'none',
                                 fontSize: '16px',
                                 fontWeight: 400,
                                 bgcolor: 'transparent',
                                 '&:hover': { 
                                     bgcolor: 'rgba(0, 0, 0, 0.04)',
                                 }
                             }}>
                             Log In
                         </Button>
                     </Stack>

                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerToggle}
                        sx={{ display: { md: 'none' }, color: '#141414', zIndex: 1100 }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box component="nav">
                <Drawer
                    variant="temporary"
                    anchor="right"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            <Image />
            
            <FlexboxSection/>
            <Box id="subscription" sx={{ scrollMarginTop: '100px' }}>
                <Subscription/>
            </Box>
            <CommentSection />
            <FAQSection/>
            <ContactSection />
        </Box>
    );
};

const Image = () => {
    const theme = useTheme();
    return (
        <Box 
            className="image"
            sx={{
                height: '88vh',
                color: '#333',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                textAlign: 'center',
                mt: 14,
                overflow: 'hidden',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundImage: 'url("/landyeni.png")',
                mx: '12px',
                borderRadius: '23px',
                top: 0,
                left: 0,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    zIndex: 0,
                    borderRadius: 'inherit'
                }
            }}>
                <Typography variant="h2" component="h1" sx={{
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 500,
                    fontSize: { xs: '38px', sm: '50px', md: '64px' },
                    fontFamily: 'Inter, sans-serif',
                    position: 'absolute',
                    top: '45%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    animation: 'fadeInUp 1.2s ease-out forwards',
                    letterSpacing: 2,
                    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)',
                    '@keyframes fadeInUp': {
                      '0%': {
                        opacity: 0,
                        transform: 'translate(-50%, -30%)'
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translate(-50%, -50%)'
                      }
                    }
                }}>
                    Sign everywhere, anytime with ease.
                </Typography>
                
                <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={2} 
                    sx={{
                        zIndex: 1, 
                        position: 'absolute',
                        bottom: '150px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: { xs: '85%', sm: 'auto' }
                    }}>
                    <Button variant="outlined" className='get' sx={{
                        color: '#ffffff',
                        borderColor: '#ffffff',
                        borderRadius: '64px', 
                        py: { xs: 1, sm: 1.5, md: 2 },
                        px: { xs: 2, sm: 2.5, md: 3 },
                        fontSize: { xs: '12px', sm: '14px', md: '15px' },
                        '&:hover': { 
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            borderColor: '#ffffff'
                        }
                    }}>
                        Get Klippers
                    </Button>
                    <Button variant="outlined" className='learn' sx={{
                        color: '#ffffff',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        borderRadius: '64px', 
                        py: { xs: 1, sm: 1.5, md: 2 },
                        px: { xs: 2, sm: 2.5, md: 3 },
                        fontSize: { xs: '12px', sm: '14px', md: '15px' },
                        '&:hover': { 
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            borderColor: '#ffffff'
                        }
                    }}>
                        Learn More
                    </Button>
                </Stack>
            </Box>
        );
    }

// Define props type for FeatureBox
interface FeatureBoxProps {
    icon: ReactNode; // Use ReactNode for icon elements
    title: string;
    description: string;
    sx?: object; // sx prop is optional and can be any object
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ icon, title, description, sx = {} }) => (
    <Box sx={{
        bgcolor: '#fafafa',
        border: '1px solid #e5e5e5',
        borderRadius: '16px',
        p: { xs: '20px', md: '27px 24px' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        height: '100%',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        '&:hover': {
            bgcolor: 'rgba(69, 92, 255, 0.1)',
            boxShadow: '0 4px 10px rgba(69, 92, 255, 0.2)',
            borderColor: '#455cff'
        },
        ...sx
    }}>
        <Box sx={{ fontSize: '48px', color: '#455cff', mb: 2 }}>{icon}</Box>
        <Typography variant="h5" component="h3" sx={{ fontSize: { xs: '18px', md: '24px' }, fontWeight: 600, color: '#333', mb: 2 }}>
            {title}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: '14px', md: '16px' }, color: '#666', lineHeight: 1.6, maxWidth: '90%' }}>
            {description}
        </Typography>
    </Box>
);

const FlexboxSection = () => {
    const features1 = [
        { icon: <SecurityIcon fontSize="inherit" />, title: "Secure & Legally Binding", description: "Your documents are protected with industry-leading security standards, ensuring legal validity and compliance.", widthMd: 7 },
        { icon: <SpeedIcon fontSize="inherit" />, title: "Fast & Easy to Use", description: "Sign documents in minutes with our intuitive interface. No complex setups required.", widthMd: 5 },
    ];
    const features2 = [
        { icon: <AccountTreeIcon fontSize="inherit" />, title: "Automated Workflows", description: "Streamline your signing processes with customizable automated workflows, saving time and reducing manual effort. Set up sequential or parallel signing orders, send automatic reminders, and track progress effortlessly.", widthMd: 12 },
    ];
    const features3 = [
        { icon: <DescriptionIcon fontSize="inherit" />, title: "Supports Multiple Formats", description: "Upload and sign various document types, including PDF, Word, Excel, and more.", widthMd: 5 },
        { icon: <DevicesIcon fontSize="inherit" />, title: "Works on Any Device", description: "Access and sign your documents seamlessly from your desktop, tablet, or smartphone.", widthMd: 7 },
    ];
    const features4 = [
         { icon: <GroupsIcon fontSize="inherit" />, title: "Multiple Signers & Real-Time Tracking", description: "Invite multiple participants to sign documents in a specified order or all at once. Monitor the signing status and receive notifications in real-time.", widthMd: 12 },
    ];

    return (
        <Box id="flexbox" sx={{
            scrollMarginTop: '100px',
            py: { xs: '40px', md: '70px' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
        }}>
            <Typography className="section-title" variant="h2" component="div" sx={{
                fontSize: { xs: '28px', md: '42px' },
                fontWeight: 600,
                color: '#212121',
                textAlign: 'center',
                mb: { xs: 3, md: 3 }
            }}>
                Power up with Klippers
            </Typography>

            <Container maxWidth="md">
                <Grid container spacing={2} justifyContent="center">
                    {features1.map((feature, index) => (
                        <Grid item xs={12} md={feature.widthMd} key={index}>
                            <FeatureBox {...feature} />
                        </Grid>
                    ))}
                     {features2.map((feature, index) => (
                         <Grid item xs={12} md={feature.widthMd} key={index}>
                             <FeatureBox {...feature} />
                         </Grid>
                     ))}
                    {features3.map((feature, index) => (
                        <Grid item xs={12} md={feature.widthMd} key={index}>
                            <FeatureBox {...feature} />
                        </Grid>
                    ))}
                     {features4.map((feature, index) => (
                         <Grid item xs={12} md={feature.widthMd} key={index}>
                             <FeatureBox {...feature} />
                         </Grid>
                     ))}
                 </Grid>
             </Container>
         </Box>
     );
 }

const CommentSection = () => {
    const comments = [
        { text: "Klippers has revolutionized how we handle contracts. It's incredibly fast and secure. Highly recommended!", author: "- Anya Petrova, Tech Solutions Ltd." },
        { text: "The ease of use is outstanding. We onboarded our entire team in less than a day. The automated workflows save us hours.", author: "- Kenji Tanaka, Global Innovations Inc." },
        { text: "Reliable, compliant, and works perfectly across all our devices. Klippers is a game-changer for remote work.", author: "- Fatima Rossi, Creative Agency Co." },
        { text: "The support team is fantastic! They helped us integrate Klippers seamlessly with our existing systems.", author: "- David Müller, Enterprise Group GmbH" }
    ];

    return (
        <Box className="comment-section" sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            height: { xs: 'auto', md: '720px' },
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)',
            mt: { xs: '30px', md: '88px' },
            mb: { xs: '30px', md: '96px' },
            mx: 1,
            borderRadius: '23px',
            position: 'relative',
            overflow: 'hidden',
            p: { xs: '30px 15px', md: 0 }
        }}>
            <Grid container sx={{ height: '100%', zIndex: 1 }}>
                <Grid item xs={12} md={6} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: { xs: '20px', md: '40px' },
                    borderBottom: { xs: '1px solid rgba(0, 0, 0, 0.1)', md: 'none' },
                    mb: { xs: 4, md: 0 }
                }}>
                    <Typography className="main-quote-text" sx={{
                        fontSize: { xs: '20px', md: '28px' },
                        fontWeight: 500,
                        lineHeight: 1.4,
                        color: '#333',
                        mb: 3,
                        maxWidth: '80%'
                    }}>
                        "Klippers transformed our document workflow. It's the perfect blend of security, speed, and simplicity."
                    </Typography>
                    <Typography className="main-quote-author" sx={{
                        fontSize: { xs: '15px', md: '18px' },
                        fontWeight: 300,
                        color: '#555'
                    }}>
                        - CEO, Major Corp
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: { xs: 'flex-start', md: 'space-around' },
                    alignItems: 'center',
                    gap: { xs: 2, md: 2 },
                    p: { xs: 0, md: '40px' },
                    overflowY: { xs: 'visible', md: 'auto' },
                    maxHeight: { md: '100%' }
                }}>
                    {comments.map((comment, index) => (
                        <Box key={index} className="comment-box" sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.4)',
                            borderRadius: '12px',
                            p: { xs: '15px', md: '25px 20px' },
                            border: '1px solid rgba(0, 0, 0, 0.05)',
                            maxWidth: { xs: '100%', md: '90%' },
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                            width: '100%',
                            boxSizing: 'border-box',
                            textAlign: 'left',
                            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.55)',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                            }
                        }}>
                            <Typography className="comment-text" sx={{
                                fontStyle: 'italic',
                                lineHeight: 1.6,
                                mb: 1.5,
                                color: '#444',
                                fontSize: { xs: '13px', md: '15px' }
                            }}>
                                {comment.text}
                            </Typography>
                            <Typography className="comment-author" sx={{
                                fontWeight: 600,
                                textAlign: 'right',
                                color: '#141414',
                                fontSize: { xs: '12px', md: '14px' }
                            }}>
                                {comment.author}
                            </Typography>
                        </Box>
                    ))}
                </Grid>
            </Grid>
        </Box>
    );
}

const FAQSection = () => {
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const faqs = [
        { id: 'faq1', question: "How secure is Klippers?", answer: "Very. Our data centers are located in London, giving us the best local privacy laws." },
        { id: 'faq2', question: "How does Klippers ensure compliance with data protection laws?", answer: "Klippers complies with all relevant data protection laws and regulations." },
        { id: 'faq3', question: "Can I integrate Klippers with other tools and platforms?", answer: "Yes, Klippers offers various integration options." },
        { id: 'faq4', question: "Can I revoke or cancel a document after sending it?", answer: "Yes, you can revoke or cancel a document at any time." }
    ];

    return (
        <Container id="faq" maxWidth="lg" sx={{ py: { xs: '30px', md: '80px' }, scrollMarginTop: '100px' }}>
            <Grid container spacing={{ xs: 4, md: 8 }} alignItems="flex-start">
                <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '24px', md: '32px' }, fontWeight: 600, mb: { xs: 2, md: 4 } }}>
                        Frequently Asked Questions
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '14px', md: '16px' }, color: 'text.secondary', mb: 3 }}>
                        Let's help you with some of your frequently asked questions.
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '14px', md: '16px' }, color: 'text.secondary' }}>
                        Couldn't find your answer? <Link href="#" sx={{ color: 'primary.main', textDecoration: 'none' }}>Contact Us</Link>
                    </Typography>
                </Grid>

                <Grid item xs={12} md={7}>
                    <Box>
                        {faqs.map((faq) => (
                            <Accordion
                                key={faq.id}
                                expanded={expanded === faq.id}
                                onChange={handleChange(faq.id)}
                                sx={{
                                    boxShadow: 'none',
                                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                                    '&:before': { display: 'none' },
                                    '&.Mui-expanded': { margin: 0 },
                                    bgcolor: 'transparent',
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={`${faq.id}-content`}
                                    id={`${faq.id}-header`}
                                    sx={{
                                        py: { xs: 1, md: 1.5 },
                                        minHeight: 'auto',
                                        '& .MuiAccordionSummary-content': { margin: '12px 0' },
                                        '&.Mui-expanded': { minHeight: 'auto' },
                                        '&:hover': {
                                            bgcolor: 'transparent'
                                        }
                                    }}
                                >
                                    <Typography sx={{ fontSize: { xs: '14px', md: '18px' }, fontWeight: 300 }}>{faq.question}</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 0, pb: 2, pl: { xs: 2, md: 2 }, pr: 0 }}>
                                    <Typography sx={{ fontSize: { xs: '14px', md: '16px' }, color: '#8b8b8b' }}>
                                        {faq.answer}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

const ContactSection = () => {
    return (
        <Box 
            id="contact"
            className="contact-section" 
            sx={{
                scrollMarginTop: '100px',
                bgcolor: '#000',
                color: '#fff',
                height: { xs: 'auto', md: 'auto' },
                display: 'flex',
                flexDirection: 'column',
                width: 'auto',
                py: { xs: '30px', md: '64px' },
                px: { xs: '15px', md: '5%' },
                borderTopRightRadius: '23px',
                borderTopLeftRadius: '23px',
                mx: { xs: 1, md: 1 },
                mt: { xs: '30px', md: '64px' },
            }}>
            <Container maxWidth="lg">
                <Typography variant="h1" component="h1" sx={{
                    fontSize: { xs: '28px', md: '48px' },
                    fontWeight: 700,
                    mb: { xs: 1, md: 1 },
                    lineHeight: 1.2,
                    textAlign: { xs: 'center', md: 'left' },
                }}>
                    Register for the Secure
                </Typography>
                 <Typography variant="h1" component="h1" sx={{
                     fontSize: { xs: '28px', md: '48px' },
                     fontWeight: 700,
                     mb: { xs: 3, md: 5 },
                     lineHeight: 1.2,
                     textAlign: { xs: 'center', md: 'left' },
                 }}>
                     Document Signing!
                 </Typography>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                    sx={{
                        mt: { xs: 4, md: 5 },
                        maxWidth: { xs: '100%', sm: '70%', md: '500px' },
                        mx: { xs: 'auto', md: 0 }
                    }}
                >
                    <TextField
                        type="email"
                        placeholder="Email"
                        variant="filled"
                        fullWidth
                        sx={{
                            borderRadius: '50px',
                            bgcolor: '#222',
                            '& .MuiFilledInput-root': {
                                borderRadius: '50px',
                                bgcolor: '#222',
                                border: 'none',
                                '&:hover': { bgcolor: '#333' },
                                '&.Mui-focused': { bgcolor: '#333' },
                            },
                            '& .MuiFilledInput-input': {
                                color: '#fff',
                                py: '15px',
                                px: '24px',
                            },
                        }}
                        InputProps={{ disableUnderline: true }}
                    />
                    <Button
                        variant="contained"
                        className="signup-btn"
                        sx={{
                            py: '15px',
                            px: '40px',
                            borderRadius: '50px',
                            bgcolor: '#455cff',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: 600,
                            textTransform: 'none',
                            whiteSpace: 'nowrap',
                            '&:hover': { bgcolor: '#4a4cda' },
                            flexShrink: 0
                        }}
                    >
                        Request a Demo
                    </Button>
                </Stack>
            </Container>
            <Footer />
        </Box>
    );
};

const Footer = () => {
    return (
        <Box component="footer" sx={{
            py: { xs: 3, md: 5 },
            mt: 'auto',
             px: { xs: 2, md: '5%' }
        }}>
            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 3, md: 2 }} justifyContent="space-between" alignItems={{ xs: 'center', md: 'flex-start' }} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: { xs: 'center', md: 'flex-start' } }}>
                        <Link href="#" sx={{ color: '#fff', textDecoration: 'none', fontSize: '16px' }}>Home</Link>
                        <Typography sx={{ color: '#666', fontSize: '14px' }}>Dedicated to Sign, 2025 ©</Typography>
                        <Typography sx={{ color: '#666', fontSize: '14px' }}>Klippers</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, justifyContent: 'center', gap: { xs: 2, sm: 1 }, alignItems: 'center' }}>
                        <Link href="#" sx={{ color: '#fff', textDecoration: 'none', fontSize: '16px' }}>X.com</Link>
                        <Link href="#" sx={{ color: '#fff', textDecoration: 'none', fontSize: '16px' }}>Instagram</Link>
                        <Link href="#" sx={{ color: '#fff', textDecoration: 'none', fontSize: '16px' }}>Facebook</Link>
                    </Grid>

                    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: { xs: 'center', md: 'flex-end' }, textAlign: { xs: 'center', md: 'right' } }}>
                        <Typography sx={{ color: '#666', fontSize: '14px' }}>
                            This is the <Link href="https://bwaystudio.com/" target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none' }}><Box component="span" sx={{ color: '#fff', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>B/Way Studio</Box></Link> design.
                        </Typography>
                        <Typography sx={{ color: '#666', fontSize: '14px' }}>Design that flows,</Typography>
                        <Typography sx={{ color: '#666', fontSize: '14px' }}>easy to experience.</Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default LandPage;
