import styles from '../MainMap.module.css'


interface ClusterStyle {
  className: string;
  size: number;
}

export function getClusterStyle(
  count:number
):ClusterStyle{

  if(count>=20){
    return {
      className:styles.clusterLg,
      size:90
    }
  }

  if(count>=10){
    return {
      className:styles.clusterMd,
      size:70
    }
  }

  return {
    className:styles.clusterSm,
    size:50
  }

}