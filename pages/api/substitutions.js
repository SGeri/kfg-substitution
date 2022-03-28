import HtmlTableToJson from "html-table-to-json";

class Substitutions {
  constructor() {
    this.todaySubstitutions = [];
    this.tomorrowSubstitutions = [];

    setInterval(async () => {
      let substitutionTables = await getJSONData();

      let s_old = this.tomorrowSubstitutions;
      let s_new = substitutionTables[1];

      let difference = s_new.filter(function (obj) {
        return !s_old.some(function (obj2) {
          return obj["Oszt."] == obj2["Oszt."] && obj["Óra"] == obj2["Óra"];
        });
      });

      console.log(difference.map((obj) => obj["Oszt."]));

      difference.forEach(async (diff) => {
        await sendNotification(diff);
      });

      this.todaySubstitutions = substitutionTables[0];
      this.tomorrowSubstitutions = substitutionTables[1];
    }, 3000); // SET TO 1 MIN
  }

  getSubstitutions() {
    return {
      todaySubstitutions: this.todaySubstitutions,
      tomorrowSubstitutions: this.tomorrowSubstitutions,
    };
  }
}

async function getJSONData() {
  let response = await fetch("https://apps.karinthy.hu/helyettesites/");
  response = await response.text();

  let substitutionTables = HtmlTableToJson.parse(response);

  substitutionTables = substitutionTables.results.map((table) => {
    return table.filter((row) => row["Óra"] != "");
  });

  return substitutionTables;
}

async function sendNotification(sclass) {
  const classTime = sclass["Óra"];
  const className = sclass["Oszt."];
  const classType = sclass["Tárgy"];

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: `Basic ***`,
  };

  let response = await fetch("https://onesignal.com/api/v1/notifications", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      app_id: "66b6d47f-b3bd-4793-904b-e4c85943b78f",
      headings: { en: "Helyettesítés" },
      contents: {
        en: `Helyettesítés: ${classTime}. óra: ${classType} (${className})`,
      },
      subtitle: {
        en: "Koppints a helyettesítés részleteinek megtekintéséhez!",
      },
      url: `/?cname=${className}`,
      filters: [
        { field: "tag", key: "class", relation: "=", value: className },
      ],
    }),
  });
  response = await response.json();
}

let substitutions = new Substitutions();

export default function handler(req, res) {
  res.status(200).json({ substitutions: substitutions.getSubstitutions() });
}
