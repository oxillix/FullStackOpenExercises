const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs
        .map((blog) => blog.likes)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite;
  }, blogs[0]);
};

const mostBlogs = (blogs) => {
  // Use the `countBy` function to count the number of blogs for each author
  const blogCounts = _.countBy(blogs, "author");

  // Use maxBy to find the author with the highest count
  const topAuthor = _.maxBy(
    Object.entries(blogCounts),
    ([author, count]) => count
  );

  return {
    author: topAuthor[0],
    blogs: topAuthor[1],
  };
};

const mostLikes = (blogs) => {
  // Group the blogs by author
  const authorLikes = _.groupBy(blogs, "author");

  // Calculate the total number of likes for each author
  const authorLikesCount = _.mapValues(authorLikes, (blogs) =>
    _.sumBy(blogs, "likes")
  );

  // Find the author with the most likes
  const [author, likes] = _.maxBy(
    Object.entries(authorLikesCount),
    ([_, likes]) => likes
  );

  return { author, likes };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
