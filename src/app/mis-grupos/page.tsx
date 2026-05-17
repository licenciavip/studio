
import Link from 'next/link';
import { groups } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { Group } from '@/lib/types';

function StatusBadge({ status }: { status: Group['status'] }) {
  return (
    <Badge
      className={cn("rounded-full px-3", {
        'bg-secondary/10 text-secondary border-secondary/20': status === 'Activo',
        'bg-orange-100 text-orange-800 border-orange-200': status === 'Incompleto',
      })}
      variant="outline"
    >
      {status}
    </Badge>
  );
}

export default function MisGruposPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-sora font-bold text-on-surface">Mis Grupos</h1>
        <p className="text-on-surface-variant max-w-md mx-auto">
          Gestiona tus suscripciones compartidas, mira tus ganancias y el estado de los cupos.
        </p>
      </div>

      <Card className="bg-surface-container-lowest border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm">
        <CardHeader>
          <CardTitle className="font-sora">Grupos Compartidos</CardTitle>
          <CardDescription>
            Suscripciones que estás administrando actualmente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Servicio</TableHead>
                <TableHead className="font-bold">Cupos</TableHead>
                <TableHead className="font-bold">Precio Público</TableHead>
                <TableHead className="font-bold">Ganancia Neta</TableHead>
                <TableHead className="text-right font-bold">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id} className="group cursor-pointer">
                  <TableCell className="font-medium">
                    <Link href={`/mis-grupos/${group.id}`} className="text-primary hover:underline font-bold">
                      {group.service}
                    </Link>
                  </TableCell>
                  <TableCell className="text-on-surface-variant font-medium">
                    {group.slots.filled} / {group.slots.total}
                  </TableCell>
                  <TableCell className="text-on-surface-variant">${group.publicPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-secondary font-bold">${group.netEarning.toFixed(2)}</TableCell>
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
