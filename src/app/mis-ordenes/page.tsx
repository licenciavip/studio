import Link from 'next/link';
import { orders } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/lib/types';

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge
      className={cn({
        'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300': status === 'Activo',
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300': status === 'Pendiente',
        'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300': status === 'En disputa',
        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': status === 'Finalizado',
      })}
      variant="outline"
    >
      {status}
    </Badge>
  );
}

export default function MisOrdenesPage() {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-headline font-bold">Mis Órdenes</h1>
        <p className="text-muted-foreground">
          Aquí puedes ver el historial y estado de todas tus suscripciones.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Historial de Órdenes</CardTitle>
          <CardDescription>
            El detalle de todas las suscripciones a las que te has unido.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead className="hidden md:table-cell">Anfitrión</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell">Vencimiento</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.service}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.host}</TableCell>
                  <TableCell>${order.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{order.expires}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                           <Link href={`/disputas/${order.id}`}>Abrir Disputa</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
