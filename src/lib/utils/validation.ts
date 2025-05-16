export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string) => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");
  // Phone number should be exactly 10 digits
  return cleaned.length === 10;
};

export const formatPhoneNumber = (value: string) => {
  // Remove all non-numeric characters
  const phone = value.replace(/\D/g, "");

  // Limit to 10 digits
  const truncated = phone.slice(0, 10);

  // Format as (XXX) XXX-XXXX
  if (truncated.length === 0) return "";
  if (truncated.length <= 3) return truncated;
  if (truncated.length <= 6)
    return `(${truncated.slice(0, 3)}) ${truncated.slice(3)}`;
  return `(${truncated.slice(0, 3)}) ${truncated.slice(3, 6)}-${truncated.slice(6)}`;
};
