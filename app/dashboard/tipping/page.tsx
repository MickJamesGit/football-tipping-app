import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Tipping",
};
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import PageHeading from "@/app/ui/dashboard/page-heading";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchUserCompetitions } from "@/app/lib/data";
import { lusitana } from "@/app/ui/fonts";

export type Competition = {
  id: string;
  name: string;
};

export type UserCompetitions = {
  signedUp: Competition[];
  notSignedUp: Competition[];
};

export default async function Page() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return redirect("/login");
  }

  const competitions: UserCompetitions = await fetchUserCompetitions(
    session.user.id
  );

  return (
    <div className="w-full space-y-8">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Typography color="text.primary">Tipping menu</Typography>
      </Breadcrumbs>
      <PageHeading title="Tipping" />
      <div className="w-full">
        {competitions.signedUp.length > 0 && (
          <>
            <h1
              className={`${lusitana.className} text-3xl text-left mt-4 mb-2 border-b pb-2`}
            >
              Registered Competitions
            </h1>
            <div className="flex flex-wrap gap-4 mt-6">
              {competitions.signedUp.map((competition) => (
                <Card key={competition.id} sx={{ maxWidth: 345 }}>
                  <CardActionArea
                    href={`/dashboard/tipping/tips?sport=${competition.name}`}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={`/cards/${competition.name}.webp`}
                      alt={competition.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {competition.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Enter or update your tips for the upcoming{" "}
                        {competition.name} games.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </div>
          </>
        )}
        {competitions.notSignedUp.length > 0 && (
          <>
            {competitions.signedUp.length > 0 && (
              <h1
                className={`${lusitana.className} text-3xl text-left mt-8 mb-2 border-b pb-2`}
              >
                Unregistered Competitions
              </h1>
            )}
            <div className="flex flex-wrap gap-4 mt-6">
              {competitions.notSignedUp.map((competition) => (
                <Card key={competition.id} sx={{ maxWidth: 345 }}>
                  <CardActionArea
                    href={`/dashboard/tipping/tips?sport=${competition.name}`}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={`/cards/${competition.name}.webp`}
                      alt={competition.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {competition.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Register now for the {competition.name} season.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
