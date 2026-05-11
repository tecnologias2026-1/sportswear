export class GestorProductos {

   async cargarProductos(rutaJSON) {
      try {
         const response = await fetch(rutaJSON);
         const data = await response.json();

         this.productos = data.map( d => new Producto(d));
         this.productosFiltrados = [...this.productos];
         return this.productos;
      } catch (error) {
         console.error("Error al cargar productos:", error);
         return [];
      }
   }
   
   obtenerCategorias() {
     return [...new Set(this.productos.map(p => p.categoria))];
   }

   obtenerMarcas() {
      return [...new Set(this.productos.map(p => p.marca))];
   }

   obtenerColores() {
      return [...new Set(this.productos.map(p => p.color))];
   }

   obtenerTallas() {
    const tallas = new Set();
    this.productos.forEach(p => {
      if (Array.isArray(p.talla)) {
        p.talla.forEach(t => tallas.add(t));
      }
   });    return Array.from(tallas);
    }

    aplicarFiltros(){
        this.productosFiltrados = this.productos.filter(p => {
            if (this.aplicarFiltros.categorias.length > 0 && !this.aplicarFiltros.categorias.includes(p.categoria)) return false;
            if (this.aplicarFiltros.marcas.length > 0 && !this.aplicarFiltros.marcas.includes(p.marca)) return false;
            if (this.aplicarFiltros.colores.length > 0 && !this.aplicarFiltros.colores.includes(p.color)) return false;
            if (this.aplicarFiltros.tallas.length > 0 && !this.aplicarFiltros.tallas.includes(p.talla)) return false;
            return true;
        });
    }
}

export class Producto {
   constructor(datos) {
      this.id = datos.id;
      this.nombre = datos.nombre;
      this.categoria = datos.categoria;
      this.marca = datos.marca;
      this.color = datos.color;
      this.talla = datos.talla;
      this.precio = datos.precio;
      this.imagen = datos.imagen;
   }

getPrecioFormateado() {
   return `$${this.precio.toLocaleString('es-CO')}`;
}
}
