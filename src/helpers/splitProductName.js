export const splitProductName = (productName) => {
  if (!productName) {
    return { firstPart: "", secondPart: "" };
  }

  const withDelimiter = " with ";
  const asteriskDelimiter = "*";

  const withIndex = productName.indexOf(withDelimiter);
  const asteriskIndex = productName.indexOf(asteriskDelimiter);

  if (withIndex !== -1) {
    return {
      firstPart: productName.slice(0, withIndex).trim(),
      // Include "with" in the second part
      secondPart: productName.slice(withIndex).trim(),
    };
  } else if (asteriskIndex !== -1) {
    return {
      firstPart: productName.slice(0, asteriskIndex).trim(),
      // Do not include the asterisk itself
      secondPart: productName.slice(asteriskIndex + 1).trim(),
    };
  } else {
    return {
      firstPart: productName.trim(),
      secondPart: "",
    };
  }
};