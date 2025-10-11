import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CardItemTotalProps {
  title: string;
  total: number | string;
  description?: string;
}
const CardItemTotal: React.FC<CardItemTotalProps> = ({
  title,
  total,
  description,
}) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-card-foreground">
          {title}{" "}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{total}</div>
        <p className="text-xs text-muted-foreground">{description} </p>
      </CardContent>
    </Card>
  );
};

export default CardItemTotal;
