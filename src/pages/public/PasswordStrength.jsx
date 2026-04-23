export default function PasswordStrength({ password }) {
  if (!password) return null;

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++; // numbers
  if (/[@$!%*?&]/.test(password)) strength++; // special chars
  if (/[^A-Za-z0-9@$!%*?&]/.test(password)) strength++; // other special chars

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-green-600',
    'bg-green-700',
  ];
  const textColors = [
    'text-red-500',
    'text-orange-500',
    'text-yellow-500',
    'text-green-500',
    'text-green-600',
    'text-green-700',
  ];

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-color duration-300 ${i < strength ? colors[strength] : 'bg-border'}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColors[strength]}`}>
        {labels[strength]}
      </p>
    </div>
  );
}
