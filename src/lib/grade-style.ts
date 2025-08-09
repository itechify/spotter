export const getGradeBackgroundColorClass = (grade: string) => {
  switch (grade) {
    case "V-easy":
    case "V0":
      return "bg-beginner/10";
    case "V1":
    case "V2":
      return "bg-novice/10";
    case "V3":
    case "V4":
    case "V5":
      return "bg-intermediate/10";
    case "V6":
    case "V7":
    case "V8":
      return "bg-advanced/10";
    case "V9":
    case "V10":
    case "V11":
    case "V12":
      return "bg-expert/10";
    case "V13":
    case "V14":
    case "V15":
    case "V16":
    case "V17":
      return "bg-elite/10";
    default:
      return "bg-beginner/10";
  }
};

export const getGradeBorderColorClass = (grade: string) => {
  switch (grade) {
    case "V-easy":
    case "V0":
      return "border-beginner";
    case "V1":
    case "V2":
      return "border-novice";
    case "V3":
    case "V4":
    case "V5":
      return "border-intermediate";
    case "V6":
    case "V7":
    case "V8":
      return "border-advanced";
    case "V9":
    case "V10":
    case "V11":
    case "V12":
      return "border-expert";
    case "V13":
    case "V14":
    case "V15":
    case "V16":
    case "V17":
      return "border-elite";
    default:
      return "border-beginner";
  }
};

// Hover helpers to amplify the card's background tint and glow color
export const getGradeHoverBackgroundClass = (grade: string) => {
  switch (grade) {
    case "V-easy":
    case "V0":
      return "hover:bg-beginner/20";
    case "V1":
    case "V2":
      return "hover:bg-novice/20";
    case "V3":
    case "V4":
    case "V5":
      return "hover:bg-intermediate/20";
    case "V6":
    case "V7":
    case "V8":
      return "hover:bg-advanced/20";
    case "V9":
    case "V10":
    case "V11":
    case "V12":
      return "hover:bg-expert/20";
    case "V13":
    case "V14":
    case "V15":
    case "V16":
    case "V17":
      return "hover:bg-elite/20";
    default:
      return "hover:bg-beginner/20";
  }
};

export const getGradeRingColorClass = (grade: string) => {
  switch (grade) {
    case "V-easy":
    case "V0":
      return "hover:ring-beginner/50";
    case "V1":
    case "V2":
      return "hover:ring-novice/50";
    case "V3":
    case "V4":
    case "V5":
      return "hover:ring-intermediate/50";
    case "V6":
    case "V7":
    case "V8":
      return "hover:ring-advanced/50";
    case "V9":
    case "V10":
    case "V11":
    case "V12":
      return "hover:ring-expert/50";
    case "V13":
    case "V14":
    case "V15":
    case "V16":
    case "V17":
      return "hover:ring-elite/50";
    default:
      return "hover:ring-beginner/50";
  }
};
