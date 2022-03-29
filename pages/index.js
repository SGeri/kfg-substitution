import { useState, useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import {
  createStyles,
  Container,
  Select,
  Button,
  Paper,
  Text,
  Switch,
  Group,
  ThemeIcon,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { Bell, Smartphone } from "react-feather";

const CLASSES = [
  "9.AK",
  "9.BK",
  "9.CK",
  "9.EK",
  "9.A",
  "9.B",
  "9.C",
  "9.D",
  "9.E",
  "10.A",
  "10.B",
  "10.C",
  "10.D",
  "10.E",
  "11.A",
  "11.B",
  "11.C",
  "11.D",
  "11.E",
  "11.IB",
  "12.A",
  "12.B",
  "12.C",
  "12.D",
  "12.E",
  "12.IB",
]; // IB? jó ez így?

export default function Home(props) {
  const router = useRouter();
  const modals = useModals();

  const [substitutionCards, setSubstitutionCards] = useState([]);
  const [selectedClass, setSelectedClass] = useState(router.query.cname);
  const [today, setToday] = useState(true);

  const loadOneSignal = () => {
    OneSignal.push(function () {
      OneSignal.init({
        appId: "66b6d47f-b3bd-4793-904b-e4c85943b78f",
        safari_web_id:
          "web.onesignal.auto.19aac151-6a52-4f31-b603-0bf7908b06b4",
      });
    });
  };

  const onChangeClasses = async (e) => {
    await setSelectedClass(e);
  };

  const onChangeDay = async () => {
    await setToday(!today);
  };

  const setNotifications = async () => {
    if (typeof OneSignal === "undefined") {
      modals.openModal({
        title: "Hidetésblokkoló",
        children: (
          <>
            <Text align="center" weight="bold" mb={10}>
              A hirdetésblokkolód letiltja az értesítéseket!
            </Text>
            <Text mb={10}>
              Kapcsold ki az Adblocker bővítményt és a hirdetésblokkoló
              funkciókat a böngésződben.
            </Text>
            <Text>
              A Google Chrome böngésző használata ajánlott, hogy az eszközödön
              értesítéseket kapj a helyettesítésekről.
            </Text>
          </>
        ),
      });
      return;
    }

    const supported = OneSignal.isPushNotificationsSupported();
    const ready = supported && selectedClass;

    modals.openModal({
      title: "Értesítések - Információk",
      children: (
        <>
          {!selectedClass ? (
            <Group position="center" direction="row" noWrap mb={20}>
              <ThemeIcon
                radius="lg"
                size="lg"
                variant="gradient"
                gradient={{ from: "red", to: "cyan" }}
              >
                !
              </ThemeIcon>
              <Group direction="column" spacing={0}>
                <Text weight="bold">Osztályválasztás</Text>
                <Text>
                  Az értesítések engedélyezéséhez kérlek válassz egy osztályt
                  először!
                </Text>
              </Group>
            </Group>
          ) : (
            <Group position="center" direction="row" noWrap mb={20}>
              <ThemeIcon
                radius="lg"
                size="lg"
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan" }}
              >
                <Bell />
              </ThemeIcon>
              <Group direction="column" spacing={0}>
                <Text weight="bold">Helyettesítések</Text>
                <Text>
                  Értesítés fogsz kapni, ha egy új helyettesítést írnak ehhez az
                  osztályhoz: {selectedClass}.
                </Text>
              </Group>
            </Group>
          )}

          {!supported ? (
            <Group position="center" direction="row" noWrap mb={20}>
              <ThemeIcon
                radius="lg"
                size="lg"
                variant="gradient"
                gradient={{ from: "red", to: "cyan" }}
              >
                !
              </ThemeIcon>
              <Group direction="column" spacing={0}>
                <Text weight="bold">Böngésző / IOS támogatás</Text>
                <Text>
                  Jelenleg IOS platformon és bizonyos böngészőkben (Chrome
                  használata ajánlott!) nem lehetséges a böngésző értesítések
                  megjelenítése.
                </Text>
              </Group>
            </Group>
          ) : (
            <Group position="center" direction="row" noWrap mb={20}>
              <ThemeIcon
                radius="lg"
                size="lg"
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan" }}
              >
                <Smartphone />
              </ThemeIcon>
              <Group direction="column" spacing={0}>
                <Text weight="bold">Böngésző értesítések</Text>
                <Text>
                  Az eszközöd alkalmas böngésző értesítések küldésére, kattints
                  az alábbi gombra, majd engedélyezd az értesítéseket!
                </Text>
              </Group>
            </Group>
          )}

          <Button disabled={!ready} onClick={onSubmit} fullWidth>
            Értesítések engedélyezése
          </Button>
        </>
      ),
    });
  };

  const onSubmit = async () => {
    await OneSignal.showNativePrompt();

    OneSignal.push([
      "getNotificationPermission",
      async function (permission) {
        if (permission === "granted") {
          await OneSignal.sendTag("class", selectedClass);

          modals.openModal({
            title: "Értesítések - Engedélyezve",
            children: (
              <>
                <Text align="center" weight="bold" mb={10}>
                  Sikeresen engedélyezted az értesítéseket!
                </Text>
                <Text align="center" mb={20}>
                  Mostantól értesítést fogsz kapni az új helyettesítésekről!
                </Text>
                <Button fullWidth onClick={() => modals.closeAll()}>
                  Rendben!
                </Button>
              </>
            ),
          });
        } else {
          modals.openModal({
            title: "Értesítések - Elutasítva",
            children: (
              <>
                <Text align="center" weight="bold" mb={10}>
                  Nem sikerült engedélyezned az értesítéseket!
                </Text>
                <Text align="center" mb={20}>
                  Ha nem jelent meg egy ablak, amiben az értesítéseket
                  engedélyezheted, próbáld meg a beállításokban engedélyezni az
                  értesítéseket!
                </Text>
                <Button fullWidth onClick={() => modals.closeAll()}>
                  Rendben!
                </Button>
              </>
            ),
          });
        }
      },
    ]);
  };

  useEffect(() => {
    let subs = today
      ? props.substitutions.todaySubstitutions
      : props.substitutions.tomorrowSubstitutions;

    subs = subs.filter((sub) => {
      const subClass = sub["Oszt."];

      return selectedClass ? classTest(subClass, selectedClass) : false;
    });

    const sortedSubstitutions = subs.sort((a, b) => {
      return a["Óra"] - b["Óra"];
    });

    const cards = sortedSubstitutions.map((s, index) => {
      return (
        <SubstitutionCard
          key={index}
          class={s["Oszt."]}
          time={s["Óra"]}
          subject={s["Tárgy"]}
          teacher={s["Helyettesítendő tanár"]}
          substitutor={s["Helyettesítő tanár"]}
          message={s["Megjegyzés"]}
        />
      );
    });

    setSubstitutionCards(cards);
  }, [selectedClass, today]);

  return (
    <>
      <Head>
        <title>KFG Helyettesítések</title>
        <meta name="description" content="KFG Helyettesítések és értesítések" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Script
        id="onesignal"
        src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
        onLoad={loadOneSignal}
      />

      <Container mb="sm">
        <Select
          data={CLASSES}
          label="Válaszd ki, melyik osztály helyettesítései érdekelnek!"
          placeholder="Pl. 9.AK"
          onChange={onChangeClasses}
          value={selectedClass}
          mb="sm"
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Switch
            label={today ? "Ma" : "Holnap"}
            size="md"
            color="indigo"
            onChange={onChangeDay}
            mb={15}
          />

          <Button
            variant="outline"
            color="indigo"
            radius="xl"
            size="md"
            sx={{ width: "60%", minWidth: 200, maxWidth: 260 }}
            onClick={setNotifications}
          >
            Kérek értesítéseket!
          </Button>
        </div>
      </Container>
      <Container>
        {substitutionCards.length > 0 ? (
          substitutionCards
        ) : (
          <Text align="center" weight="bold">
            {today ? "Ma" : "Holnap"} a választott osztálynak nincsenek
            helyettesítései!
          </Text>
        )}
      </Container>
    </>
  );
}

const useStyles = createStyles((theme) => ({
  card: {
    position: "relative",
    cursor: "pointer",
    overflow: "hidden",
    transition: "transform 150ms ease, box-shadow 100ms ease",
    padding: theme.spacing.xl,
    paddingLeft: theme.spacing.xl * 2,

    "&:hover": {
      boxShadow: theme.shadows.md,
      transform: "scale(1.02)",
    },

    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      width: 6,
      backgroundImage: theme.fn.linearGradient(
        45,
        theme.colors.indigo[6],
        theme.colors.cyan[6]
      ),
    },
  },
}));

function SubstitutionCard(props) {
  const { classes } = useStyles();
  return (
    <Paper withBorder radius="md" mb="xs" className={classes.card}>
      <Container
        sx={{
          backgroundSize: "30%",
          backgroundRepeat: "no-repeat",
          background: `linear-gradient(45deg, indigo 30%, cyan 80%);`,
          borderRadius: 20,
        }}
      >
        <Text>{props.class}</Text>
      </Container>
      <Text size="xl" weight={500} mt="md">
        {props.time}. óra - {props.subject}
      </Text>
      <Text size="sm" mt="sm" color="dimmed">
        {props.substitutor && (
          <>
            Helyettesítő: {props.substitutor}
            <br />
          </>
        )}
        Helyettesítendő: {props.teacher}
      </Text>
      {props.message && (
        <Text size="sm" mt="sm" color="dimmed">
          Megjegyzés: {props.message}
        </Text>
      )}
    </Paper>
  );
}

function classTest(world, seed) {
  var arr = new Array(256);
  var i = 0;

  for (i = 0; i < 256; i++) {
    arr[i] = 0;
  }

  for (i = 0; i < world.length; i++) {
    arr[world.charCodeAt(i)] += 1;
  }

  for (i = 0; i < seed.length; i++) {
    arr[seed.charCodeAt(i)] -= 1;
    if (arr[seed.charCodeAt(i)] < 0) {
      return false;
    }
  }

  return true;
}

export async function getServerSideProps() {
  const request = await fetch("http://localhost:3000/api/substitutions");
  const json = await request.json();
  const substitutions = json.substitutions;

  return {
    props: {
      substitutions: substitutions,
    },
  };
}
