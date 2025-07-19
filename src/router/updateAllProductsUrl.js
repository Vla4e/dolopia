export function updateProjectUrl(project, subcategory) {
  const newPath = `/projects/${project}${subcategory ? `/${subcategory}` : ""}`;
  history.replaceState({}, "", newPath);
}