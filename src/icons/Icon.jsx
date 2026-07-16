import { icons } from "./registry";

export default function Icon({ name, ...props }) {
  const Component = icons[name];

  if (!Component) {
    console.warn(`Icon "${name}" not found`);
    return null;
  };

  return <Component {...props} />;
}