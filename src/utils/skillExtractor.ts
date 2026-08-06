const KNOWN_SKILLS = [
  'ReactJS', 'React', 'Node.js', 'Express', 'TypeScript', 'JavaScript', 'Python', 'SQL',
  'PowerBI', 'Tableau', 'Excel', 'MongoDB', 'PostgreSQL', 'MySQL', 'Docker', 'GCP', 'AWS',
  'Git', 'FastAPI', 'Django', 'Business Analysis', 'BPMN', 'Jira', 'Confluence', 'Figma',
  'Spark', 'Airflow', 'Rest API', 'HTML5', 'CSS3', 'TailwindCSS'
];

export function extractSkillsFromText(text: string): string[] {
  if (!text) return [];
  const found = new Set<string>();
  const lowerText = text.toLowerCase();

  KNOWN_SKILLS.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      found.add(skill);
    }
  });

  return Array.from(found);
}
