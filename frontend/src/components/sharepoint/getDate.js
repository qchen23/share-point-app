const getDate = (your_offset = 0) => {
  const current_date = new Date();
  const offset = current_date.getTimezoneOffset();
  const yourDate = new Date(current_date.getTime() - offset * 60 * 1000 + your_offset);

  return yourDate.toISOString().split("T")[0];
};

export default getDate;
