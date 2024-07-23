// components/RegisterCard.tsx
"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import Typography from "@mui/material/Typography";
import { updateUserCompetitions } from "@/app/lib/actions";
import { redirect, useRouter } from "next/navigation";

type RegisterCardProps = {
  userId: string;
  competition: {
    id: string;
    name: string;
  };
};

export default function RegisterCard({
  userId,
  competition,
}: RegisterCardProps) {
  const router = useRouter();
  const handleRegister = async () => {
    await updateUserCompetitions(userId, competition.id);
    router.push(`/dashboard/tipping/tips?sport=${competition.name}`);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={handleRegister}>
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
  );
}
