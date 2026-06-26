import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  Chip,
  CircularProgress,
  IconButton,
  useTheme,
  alpha,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Tooltip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import WorkIcon from '@mui/icons-material/Work';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import AssistantIcon from '@mui/icons-material/Assistant';
import SchoolIcon from '@mui/icons-material/School';
import ArticleIcon from '@mui/icons-material/Article';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { useAuth } from '../../auth/AuthContext';
import { useSnackbar } from '../../contexts/SnackbarContext';

// API function to interact with the AI assistant
const askJobAssistant = async (prompt, userContext = {}) => {
  try {
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/job-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({
        prompt,
        userContext
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI assistant response error:', response.status, errorText);
      throw new Error(`API error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling AI assistant:', error);
    throw error;
  }
};

// Helper for markdown-like formatting
const formatResponse = (text) => {
  if (!text) return '';
  
  // Format URLs
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  text = text.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Format lists
  text = text.replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>');
  text = text.replace(/(<li>.+<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // Bold text
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Format paragraphs (replace newlines with <br>)
  text = text.replace(/\n/g, '<br>');
  
  return text;
};

// Predefined suggestions to help users
const SUGGESTIONS = [
  { id: 1, text: "Help me improve my resume", icon: <ArticleIcon fontSize="small" /> },
  { id: 2, text: "What skills should I learn for web development?", icon: <SchoolIcon fontSize="small" /> },
  { id: 3, text: "Give me interview tips", icon: <TipsAndUpdatesIcon fontSize="small" /> },
  { id: 4, text: "How to write a good cover letter?", icon: <ArticleIcon fontSize="small" /> },
  { id: 5, text: "Job search strategies", icon: <WorkIcon fontSize="small" /> },
];

// Transition for dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const JobAssistant = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const messagesEndRef = useRef(null);
  
  // When user closes and reopens, maintain conversation history
  const [conversationHistory, setConversationHistory] = useState(() => {
    const saved = localStorage.getItem('jobAssistantConversation');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Load conversation from localStorage on component mount
  useEffect(() => {
    setConversation(conversationHistory);
  }, [conversationHistory]);
  
  // Save conversation to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('jobAssistantConversation', JSON.stringify(conversation));
  }, [conversation]);
  
  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  
  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleClear = () => {
    setConversation([]);
    setUserInput('');
    localStorage.removeItem('jobAssistantConversation');
    showSnackbar('Conversation cleared', 'info');
  };
  
  const handleSendMessage = async (text = userInput) => {
    if (!text.trim()) return;
    
    // Add user message to conversation
    const newUserMessage = { id: Date.now(), sender: 'user', text };
    setConversation(prev => [...prev, newUserMessage]);
    setUserInput('');
    
    // Show loading indicator
    setIsLoading(true);
    
    try {
      // Get user context for more relevant responses
      const userContext = {
        username: currentUser?.name,
        skills: currentUser?.skills || [],
        experience: currentUser?.experience || [],
        education: currentUser?.education || [],
        jobPreferences: currentUser?.jobPreferences || {}
      };
      
      // Call the AI API
      const response = await askJobAssistant(text, userContext);
      
      // Add AI response to conversation
      if (response && response.answer) {
        const newAIMessage = { 
          id: Date.now() + 1, 
          sender: 'assistant', 
          text: response.answer,
          html: formatResponse(response.answer)
        };
        setConversation(prev => [...prev, newAIMessage]);
      } else {
        throw new Error('Received empty response from assistant');
      }
    } catch (error) {
      console.error('Error sending message to assistant:', error);
      showSnackbar('Failed to get response from assistant. Please try again.', 'error');
      
      // Add error message to conversation
      const errorMessage = { 
        id: Date.now() + 1, 
        sender: 'assistant', 
        text: 'Sorry, I encountered an error. Please try again.',
        isError: true
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion.text);
  };
  
  return (
    <>
      {/* Floating action button to open the assistant */}
      <Tooltip title="Job Assistant AI">
        <Button
          onClick={handleOpen}
          variant="contained"
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            minWidth: 'auto',
            width: 56,
            height: 56,
            borderRadius: '50%',
            boxShadow: theme.shadows[4],
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <AssistantIcon />
        </Button>
      </Tooltip>
      
      {/* Chat dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            height: { xs: '100%', sm: '85vh' },
            maxHeight: '800px',
            width: { sm: '90%', md: '80%' },
            maxWidth: '900px',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
          px: 3,
          py: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                mr: 1.5,
              }}
            >
              <SmartToyIcon />
            </Avatar>
            <Typography variant="h6">JobAssistant AI</Typography>
          </Box>
          
          <Box>
            <Tooltip title="Clear conversation">
              <IconButton 
                size="small" 
                onClick={handleClear}
                sx={{ mr: 1 }}
              >
                <ArticleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ 
          px: 3, 
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Messages container */}
          <Box 
            sx={{ 
              flex: 1, 
              overflowY: 'auto',
              mb: 2,
              px: 1,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                borderRadius: '4px',
              }
            }}
          >
            {/* Welcome message if conversation is empty */}
            {conversation.length === 0 && (
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  mb: 2
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Welcome to JobAssistant AI!
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  I'm here to help with your job search. You can ask me about:
                </Typography>
                <ul style={{ paddingLeft: '20px', marginTop: 0 }}>
                  <li>Resume and cover letter tips</li>
                  <li>Interview preparation</li>
                  <li>Career advice</li>
                  <li>Skill recommendations</li>
                  <li>Job search strategies</li>
                </ul>
                <Typography variant="body2" color="text.secondary">
                  How can I assist you today?
                </Typography>
              </Paper>
            )}
            
            {/* Render conversation messages */}
            {conversation.map((message) => (
              <Box 
                key={message.id}
                sx={{ 
                  display: 'flex',
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  mb: 2,
                }}
              >
                {/* Avatar */}
                <Avatar
                  sx={{ 
                    bgcolor: message.sender === 'user' 
                      ? alpha(theme.palette.info.main, 0.1)
                      : alpha(theme.palette.primary.main, 0.1),
                    color: message.sender === 'user' 
                      ? theme.palette.info.main
                      : theme.palette.primary.main,
                    mt: 0.5,
                    mx: 1,
                    width: 36,
                    height: 36,
                  }}
                >
                  {message.sender === 'user' ? (
                    currentUser?.name?.charAt(0) || 'U'
                  ) : (
                    <SmartToyIcon fontSize="small" />
                  )}
                </Avatar>
                
                {/* Message bubble */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    maxWidth: '85%',
                    bgcolor: message.sender === 'user'
                      ? alpha(theme.palette.info.main, 0.05)
                      : message.isError
                        ? alpha(theme.palette.error.light, 0.05) 
                        : alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${
                      message.sender === 'user'
                        ? alpha(theme.palette.info.main, 0.1)
                        : message.isError
                          ? alpha(theme.palette.error.light, 0.1)
                          : alpha(theme.palette.primary.main, 0.1)
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {message.html ? (
                    <Typography 
                      variant="body2" 
                      component="div"
                      dangerouslySetInnerHTML={{ __html: message.html }}
                    />
                  ) : (
                    <Typography variant="body2">
                      {message.text}
                    </Typography>
                  )}
                </Paper>
              </Box>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <Box 
                sx={{ 
                  display: 'flex',
                  mb: 2,
                }}
              >
                <Avatar
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    mt: 0.5,
                    mx: 1,
                    width: 36,
                    height: 36,
                  }}
                >
                  <SmartToyIcon fontSize="small" />
                </Avatar>
                
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    maxWidth: '85%',
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CircularProgress size={20} sx={{ mr: 2 }} />
                  <Typography variant="body2">Thinking...</Typography>
                </Paper>
              </Box>
            )}
            
            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </Box>
          
          {/* Suggestions */}
          {conversation.length === 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="subtitle2" 
                color="text.secondary" 
                sx={{ mb: 1, fontSize: '0.75rem' }}
              >
                SUGGESTED QUESTIONS
              </Typography>
              <Stack 
                direction="row" 
                spacing={1}
                sx={{ 
                  flexWrap: 'wrap', 
                  gap: 1,
                  '& > *': {
                    mb: 1
                  }
                }}
              >
                {SUGGESTIONS.map(suggestion => (
                  <Chip
                    key={suggestion.id}
                    label={suggestion.text}
                    onClick={() => handleSuggestionClick(suggestion)}
                    icon={suggestion.icon}
                    variant="outlined"
                    sx={{
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}
          
          {/* Input area */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            borderTop: `1px solid ${theme.palette.divider}`,
            pt: 2,
          }}>
            <TextField
              fullWidth
              placeholder="Ask JobAssistant..."
              variant="outlined"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              size="small"
              multiline
              maxRows={4}
              InputProps={{
                sx: { borderRadius: 5, pr: 1 }
              }}
            />
            <IconButton 
              color="primary"
              onClick={() => handleSendMessage()}
              disabled={!userInput.trim() || isLoading}
              sx={{ ml: 1 }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobAssistant; 