
INSERT INTO `holiday` VALUES (1,'30132180xx',4,'2016-10-01','2016-10-02',NULL,'just haha',NULL,0,0,0,0),(2,'30132180xx',2,'2016-11-09','2016-11-23',NULL,'aadtggadg',NULL,0,0,0,0),(3,'3013218000',2,'2016-11-09','2016-11-22',NULL,'asdfa',NULL,3,1,0,1),(4,'3013218077',1,'2016-11-09','2016-11-12',NULL,'adsasdad',NULL,1,1,1,1),(5,'30132180xx',4,'2016-10-01','2016-10-02','2016-12-01','just test',NULL,0,0,0,0);
/*!40000 ALTER TABLE `holiday` ENABLE KEYS */;

INSERT INTO `work_add` VALUES (1,'3013218077','2016-11-30 22:53:47','2016-10-01 00:00:00','2016-10-02 00:00:00','just haha',0);
/*!40000 ALTER TABLE `work_add` ENABLE KEYS */;

INSERT INTO `worker` VALUES ('3013218000','hehe',NULL,NULL,'pbkdf2:sha1:1000$1lHQjQv6$bafc4561eddba00023ede3dcfacd217c4049f55c',7,0,0),('3013218065','wwx',NULL,NULL,'pbkdf2:sha1:1000$2qFttDTu$e19b019fc20598faba2fff280020f9aada6063a6',7,0,0),('3013218077','dont know',NULL,NULL,'pbkdf2:sha1:1000$KDp3ayQl$71c23560d9b1f975c942b3fe7a1d6206ddaa7686',7,0,0),('30132180xx','test',NULL,NULL,'pbkdf2:sha1:1000$xOvZfV5l$32db420372851cfa181ade0c276a37d8681b4d1a',7,0,0);
/*!40000 ALTER TABLE `worker` ENABLE KEYS */;

INSERT INTO `worker_degree` VALUES (1,1,'3013218000'),(1,1,'30132180xx'),(3,1,'3013218065'),(2,3,'3013218077'),(1,4,'3013218065'),(2,4,'3013218065');
