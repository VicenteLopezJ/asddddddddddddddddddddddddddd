package hct.junior.vicente.rest;

import org.springframework.web.bind.annotation.*;
import hct.junior.vicente.model.Vehiculo;
import hct.junior.vicente.service.VehiculoService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@RestController
@RequestMapping("/vehiculos")
public class VehiculoRest {
    
    private final VehiculoService vehiculoService;

    public VehiculoRest(VehiculoService vehiculoService) {
        this.vehiculoService = vehiculoService;
    }

    @GetMapping
    public Flux<Vehiculo> findAll() {
        return vehiculoService.findAll();
    }

    @GetMapping("/{id}")
    public Mono<Vehiculo> findById(@PathVariable Long id) {

        return vehiculoService.findById(id);
    }

    @PostMapping
    public Mono<Vehiculo> save(@RequestBody Vehiculo vehiculo) {
        return vehiculoService.save(vehiculo);
    }

    @PutMapping("/{id}")
    public Mono<Vehiculo> update(@PathVariable Long id, @RequestBody Vehiculo vehiculo) {
        vehiculo.setId(id);
        return vehiculoService.update(vehiculo);
    }

    @PatchMapping("/{id}/deactivate")
    public Mono<Vehiculo> deactivate(@PathVariable Long id) {
        return vehiculoService.deactivate(id);
    }

    @PatchMapping("/{id}/activate")
    public Mono<Vehiculo> activate(@PathVariable Long id) {
        return vehiculoService.activate(id);
    }

    
}
