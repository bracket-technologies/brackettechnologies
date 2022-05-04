module.exports = ({params}) => [
  "setData?data.value=().text",
  `resetStyles?():[)(:${params.state}.0].mountonload=false??)(:${params.state}`,
  `setState?)(:${params.state}=[${params.id || "().id"},${
    params.id || "().id"
  }++-icon,${params.id || "().id"}++-text,${
    params.id || "().id"
  }++-chevron]`,
  `mountAfterStyles?().mountonload:)(:${params.state}.0??)(:${params.state}`,
];
