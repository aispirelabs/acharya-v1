interface DisplayTechIconsProps {
  techStack: string[];
}

export default function DisplayTechIcons({ techStack }: DisplayTechIconsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {techStack.map((tech) => (
        <span
          key={tech}
          className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}