module.exports = ({params}) => [
  "setData?data.value=().text",
  `resetStyles?():[global().${params.state}.0].mountonload=false??global().${params.state}`,
  `setState?global().${params.state}=[${params.id || "().id"},${
    params.id || "().id"
  }++-icon,${params.id || "().id"}++-text,${
    params.id || "().id"
  }++-chevron]`,
  `mountAfterStyles?().mountonload:global().${params.state}.0??global().${params.state}`,
];
