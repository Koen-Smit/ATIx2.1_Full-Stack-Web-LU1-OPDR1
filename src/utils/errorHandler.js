/**
 * Catches all errors from controllers/services/DAO
 * Sends the user back to the same page with a flash/toast or logs the error
*/
const logger = require('./logger');

function errorHandler(err, req, res, next) {
  // Log error
  logger.error({ label: 'ERROR', message: err.stack || err.message });

  // 404, redirect to home page instead of the non-existent page
  if (err.status === 404) {
    if (req.accepts('html')) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(404).json({ 
          error: err.message,
          redirect: '/' 
        });
      }
      
      return res.status(404).redirect(`/?error=${encodeURIComponent(err.message)}`);
    }
    
    if (req.accepts('json')) {
      return res.status(404).json({ error: err.message });
    }
    
    return res.status(404).send(err.message || 'Page not found');
  }

  // For other errors, get page to redirect back to
  const referrer = req.get('Referer');
  let redirectUrl = '/';
  
  if (referrer) {
    try {
      const referrerUrl = new URL(referrer);
      redirectUrl = referrerUrl.pathname + referrerUrl.search;
    } catch (e) {
      // If not a valid URL
      redirectUrl = req.originalUrl || '/';
    }
  } else {
    redirectUrl = req.originalUrl || '/';
  }
  
  // If accepts HTML, redirect back with error message
  if (req.accepts('html')) {
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(err.status || 500).json({ 
        error: err.message,
        redirect: redirectUrl 
      });
    }
    
    // Add error parameter to URL for toast
    const separator = redirectUrl.includes('?') ? '&' : '?';
    const finalRedirectUrl = `${redirectUrl}${separator}error=${encodeURIComponent(err.message)}`;
    
    return res.status(err.status || 500).redirect(finalRedirectUrl);
  }

  // If accepts JSON, send JSON response
  if (req.accepts('json')) {
    return res.status(err.status || 500).json({ error: err.message });
  }

  res.status(err.status || 500).send(err.message || 'Something went wrong');
}

module.exports = errorHandler;
