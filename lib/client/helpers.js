Template.registerHelper('formatNumber', (number)=> {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
});

Template.registerHelper('lowerCase', (text)=> {
  return text.toLowerCase();
});
