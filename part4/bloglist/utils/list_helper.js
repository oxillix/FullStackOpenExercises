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

module.exports = {
  dummy,
  totalLikes,
};
