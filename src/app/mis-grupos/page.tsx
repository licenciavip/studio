import { groups } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { Group } from '@/lib/types';

function StatusBadge({ status }: { status: Group['status'] }) {
  return (
    <Badge
      className={cn({
        'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300': status === 'Activo',
        'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300': status === 'Incompleto',
      })}
      variant="outline"
    >
      {status}
    </Badge>
  );
}

export default function MisGruposPage() {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-headline font-bold">Mis Grupos</h1>
        <p className="text-muted-foreground">
          Gestiona tus grupos, mira tus ganancias y el estado de los cupos.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Grupos Activos</CardTitle>
          <CardDescription>
            Estos son los grupos que estás compartiendo actualmente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead>Cupos</TableHead>
                <TableHead>Precio Público</TableHead>
                <TableHead>Ganancia Neta</TableHead>
                <TableHead className="text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.service}</TableCell>
                  <TableCell>
                    {group.slots.filled} / {group.slots.total}
                  </TableCell>
                  <TableCell>${group.publicPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-green-600 font-semibold">${group.netEarning.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <StatusBadge status={group.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
