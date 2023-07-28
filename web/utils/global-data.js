export const getGlobalData = () => {
  const name = process.env.APP_NAME
    ? decodeURI(process.env.APP_NAME)
    : 'The Garden';
  const blogTitle = process.env.APP_TITLE
    ? decodeURI(process.env.APP_TITLE)
    : 'Habit tracker';
  const footerText = process.env.BLOG_FOOTER_TEXT
    ? decodeURI(process.env.BLOG_FOOTER_TEXT)
    : 'All rights reserved.';

  return {
    name,
    blogTitle,
    footerText,
  };
};
