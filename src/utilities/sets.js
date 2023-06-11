export const winningSets = [
  "012",
  "345",
  "678",
  "048",
  "246",
  "036",
  "147",
  "258",
];

export const strategies = [
  ...winningSets,
  "042368",
  "014286",
  "248065",
  "684720",
  "012458",
  "012346",
  "678340",
  "678452",
];

export const resetLineStyles = {
  top: "0",
  left: "0",
  transform: "none",
  width: "0%",
};

export const winningSetsLineStyles = {
  "012": {
    top: "16.5%",
    left: "0%",
    transform: "translateY(-50%)",
  },
  "345": {
    top: "50%",
    left: "0%",
    transform: "translateY(-50%)",
  },
  "678": {
    top: "83.5%",
    left: "0%",
    transform: "translateY(-50%)",
  },
  "048": {
    top: "9%",
    left: "15%",
    transformOrigin: "top left",
    transform: "rotate(45deg)",
  },
  "246": {
    top: "82%",
    left: "17.5%",
    transformOrigin: "bottom left",
    transform: "rotate(-45deg)",
  },
  "036": {
    top: "0",
    left: "18.5%",
    transformOrigin: "top left",
    transform: "rotate(90deg)",
  },
  "147": {
    top: "0",
    left: "53%",
    transformOrigin: "top left",
    transform: "rotate(90deg)",
  },
  "258": {
    top: "0",
    left: "87%",
    transformOrigin: "top left",
    transform: "rotate(90deg)",
  },
};
