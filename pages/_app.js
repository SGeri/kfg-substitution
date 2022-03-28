import { MantineProvider, AppShell, Header, Text } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withNormalizeCSS
      withGlobalStyles
    >
      <ModalsProvider>
        <AppShell
          padding="md"
          header={<AppHeader />}
          styles={(theme) => ({
            main: {
              backgroundColor: theme.colors.dark[8],
            },
          })}
        >
          <Component {...pageProps} />
        </AppShell>
      </ModalsProvider>
    </MantineProvider>
  );
}

function AppHeader() {
  return (
    <Header height={70} p="md">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Text
          component="span"
          align="center"
          variant="gradient"
          gradient={{
            from: "indigo",
            to: "cyan",
            deg: 45,
          }}
          size="xl"
          weight={750}
        >
          KFG Helyettesítések és értesítések
        </Text>
      </div>
    </Header>
  );
}

export default MyApp;
