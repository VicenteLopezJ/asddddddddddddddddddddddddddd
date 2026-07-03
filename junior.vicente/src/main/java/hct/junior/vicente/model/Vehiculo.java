package hct.junior.vicente.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table("vehiculo")
public class Vehiculo {
    
    @Id
    @Column("id")
    private Long id;

    @Column("placa")
    private String placa;

    @Column("marca")
    private String marca;

    @Column("modelo")
    private String modelo;
    
    @Column("anio")
    private Integer anio;

    @Column("color")
    private String color;

    @Column("precio_por_dia")
    private Double precioPorDia;

    @Column("estado")
    private Boolean estado;
}
