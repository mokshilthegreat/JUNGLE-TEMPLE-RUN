import type { Entity } from '../entities/Entity';
import type { Bounds } from '../types';

export class CollisionSystem {
  
  public static checkAABB(a: Bounds, b: Bounds): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  public static resolveWallCollision(entity: Entity, wallBounds: Bounds): boolean {
    const eb = entity.getBounds();
    
    if (this.checkAABB(eb, wallBounds)) {
      // Find overlap on all axes
      const overlapLeft = (eb.x + eb.width) - wallBounds.x;
      const overlapRight = (wallBounds.x + wallBounds.width) - eb.x;
      const overlapTop = (eb.y + eb.height) - wallBounds.y;
      const overlapBottom = (wallBounds.y + wallBounds.height) - eb.y;

      // Find the minimum overlap
      const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

      if (minOverlap === overlapLeft) {
        entity.x -= overlapLeft;
      } else if (minOverlap === overlapRight) {
        entity.x += overlapRight;
      } else if (minOverlap === overlapTop) {
        entity.y -= overlapTop;
      } else if (minOverlap === overlapBottom) {
        entity.y += overlapBottom;
      }
      
      return true;
    }
    return false;
  }

  public checkCollisions(entities: Entity[]) {
    // Simple O(N^2) for now
    // Separate static vs dynamic would be better
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const e1 = entities[i];
        const e2 = entities[j];
        
        if (!e1.active || !e2.active) continue;

        if (this.checkAABB(e1.getBounds(), e2.getBounds())) {
          e1.onCollide(e2);
          e2.onCollide(e1);
        }
      }
    }
  }
}
